import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as ort from 'onnxruntime-react-native';

// Use this path for Android assets
const MODEL_PATH = 'assets://text_logreg.onnx';

export default function Model() {
  const callModel = async () => {
    try {
      const session = await ort.InferenceSession.create(MODEL_PATH);

      const inputName = session.inputNames?.[0] || 'input';
      const inputTensor = new ort.Tensor('string', ['this is a test'], [1]);

      const outputMap = await session.run({ [inputName]: inputTensor });

      const keys = Object.keys(outputMap);
      const first = outputMap[keys[0]];
      const result = first?.data?.[0];

      Alert.alert('ONNX Result', String(result ?? 'No output'));
    } catch (err) {
      console.error('ONNX error:', err);
      Alert.alert('ONNX Error', String(err));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Model" onPress={callModel} />
    </View>
  );
}
