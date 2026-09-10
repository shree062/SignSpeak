# TensorFlow Lite Model Integration Guide for SignSpeak

This file describes how the Machine Learning model is integrated into SignSpeak and how you can replace the model with your custom trained model.

## Model Specifications:
- **File Name**: `sign_language_model.tflite`
- **Location**: `app/src/main/assets/sign_language_model.tflite`
- **Framework**: TensorFlow Lite 2.14+
- **Architecture**: CNN (Spatial Feature Extractor) + LSTM/GRU (Temporal Sequence Modeling)

### Model Input Shape:
- **Image Mode**: `[1, 224, 224, 3]` (Batch Size: 1, Height: 224, Width: 224, Channels: 3 RGB)
- **Sequence Mode (Video Frames)**: `[1, 30, 224, 224, 3]` (30 frames sequence buffer)
- **Data Type**: `FLOAT32` (normalized between [0.0, 1.0] or [-1.0, 1.0])

### Model Output Shape:
- **Output Tensor**: `[1, 25]` (Probability distribution over the 25 sign classes defined in `labels.txt`)
- **Softmax Activation**: Probabilities sum to 1.0.

### Supported Labels (matches `labels.txt`):
1. Hello
2. Thank You
3. Good Morning
4. Good Afternoon
5. Good Night
6. How are You
7. I am Fine
8. One Moment Please
9. Yes
10. No
11. Please
12. Sorry
13. Help
14. I Need Help
15. Good
16. Bad
17. Water
18. Food
19. Stop
20. Danger
21. I Love You
22. Welcome
23. Nice to Meet You
24. Restroom
25. Doctor

## How to Export Your Trained Keras/PyTorch Model to TFLite:

```python
import tensorflow as tf

# Convert saved Keras model
converter = tf.lite.TFLiteConverter.from_saved_model("path_to_saved_cnn_lstm_model")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save to assets directory
with open("app/src/main/assets/sign_language_model.tflite", "wb") as f:
    f.write(tflite_model)
```

The app's `SignLanguageClassifier.kt` automatically checks for the `.tflite` model at runtime. If present, it utilizes hardware-accelerated GPU/NNAPI inference; if absent or during early development, it seamlessly falls back to the high-accuracy gesture simulator.
