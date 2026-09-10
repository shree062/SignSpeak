package com.signspeak.app.ml

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.graphics.Rect
import android.graphics.YuvImage
import androidx.camera.core.ImageProxy
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

object PreprocessingUtils {

    const val MODEL_INPUT_SIZE = 224
    private const val BATCH_SIZE = 1
    private const val PIXEL_CHANNELS = 3 // RGB
    private const val BYTES_PER_CHANNEL = 4 // Float32

    /**
     * Converts a CameraX ImageProxy (YUV_420_888) into a rotated and scaled Bitmap
     */
    fun imageProxyToBitmap(imageProxy: ImageProxy, isFrontCamera: Boolean = false): Bitmap? {
        val yBuffer = imageProxy.planes[0].buffer // Y
        val uBuffer = imageProxy.planes[1].buffer // U
        val vBuffer = imageProxy.planes[2].buffer // V

        val ySize = yBuffer.remaining()
        val uSize = uBuffer.remaining()
        val vSize = vBuffer.remaining()

        val nv21 = ByteArray(ySize + uSize + vSize)

        yBuffer.get(nv21, 0, ySize)
        vBuffer.get(nv21, ySize, vSize)
        uBuffer.get(nv21, ySize + vSize, uSize)

        val yuvImage = YuvImage(
            nv21,
            ImageFormat.NV21,
            imageProxy.width,
            imageProxy.height,
            null
        )
        val out = ByteArrayOutputStream()
        yuvImage.compressToJpeg(Rect(0, 0, imageProxy.width, imageProxy.height), 90, out)
        val imageBytes = out.toByteArray()
        val rawBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size) ?: return null

        // Apply rotation degrees & mirror front camera
        val matrix = Matrix()
        matrix.postRotate(imageProxy.imageInfo.rotationDegrees.toFloat())
        if (isFrontCamera) {
            matrix.postScale(-1f, 1f, rawBitmap.width / 2f, rawBitmap.height / 2f)
        }

        return Bitmap.createBitmap(
            rawBitmap,
            0,
            0,
            rawBitmap.width,
            rawBitmap.height,
            matrix,
            true
        )
    }

    /**
     * Resizes and crops bitmap into a square 224x224 input suitable for CNN
     */
    fun resizeAndCenterCrop(bitmap: Bitmap, targetSize: Int = MODEL_INPUT_SIZE): Bitmap {
        val width = bitmap.width
        val height = bitmap.height

        val cropSize = minOf(width, height)
        val cropX = (width - cropSize) / 2
        val cropY = (height - cropSize) / 2

        val croppedBitmap = Bitmap.createBitmap(bitmap, cropX, cropY, cropSize, cropSize)
        return Bitmap.createScaledBitmap(croppedBitmap, targetSize, targetSize, true)
    }

    /**
     * Converts a 224x224 RGB Bitmap into a normalized Float ByteBuffer [1, 224, 224, 3]
     */
    fun bitmapToNormalizedByteBuffer(bitmap: Bitmap): ByteBuffer {
        val scaledBitmap = if (bitmap.width != MODEL_INPUT_SIZE || bitmap.height != MODEL_INPUT_SIZE) {
            resizeAndCenterCrop(bitmap, MODEL_INPUT_SIZE)
        } else {
            bitmap
        }

        val byteBuffer = ByteBuffer.allocateDirect(
            BATCH_SIZE * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * PIXEL_CHANNELS * BYTES_PER_CHANNEL
        )
        byteBuffer.order(ByteOrder.nativeOrder())
        byteBuffer.rewind()

        val intValues = IntArray(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE)
        scaledBitmap.getPixels(intValues, 0, scaledBitmap.width, 0, 0, scaledBitmap.width, scaledBitmap.height)

        var pixel = 0
        for (i in 0 until MODEL_INPUT_SIZE) {
            for (j in 0 until MODEL_INPUT_SIZE) {
                val value = intValues[pixel++]
                // Normalize pixels to [0.0f, 1.0f] (or standard ImageNet / MobileNet [-1.0f, 1.0f])
                val r = ((value shr 16 and 0xFF) / 255.0f)
                val g = ((value shr 8 and 0xFF) / 255.0f)
                val b = ((value and 0xFF) / 255.0f)

                byteBuffer.putFloat(r)
                byteBuffer.putFloat(g)
                byteBuffer.putFloat(b)
            }
        }
        return byteBuffer
    }
}
