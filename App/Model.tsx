import React from 'react';
import { View, Button, Alert } from 'react-native';
// import { InferenceSession, Tensor } from 'onnxruntime-react-native';

const Model = () => {

  const callModel = () => {
    Alert.alert("HIII")
    // try {
    //   // Load the model
    //   const session = await InferenceSession.create('text_logreg.onnx');

    //   // Input must be a string tensor
    //   const inputTensor = new Tensor('string', ['this is a test'], [1]);

    //   // Run the model
    //   const output = await session.run({ input: inputTensor });

    //   // output is an object of Tensors — usually output.label or output.probabilities
    //   const labelTensor = output.label; // adjust key to your model's output name
    //   const predicted = labelTensor.data[0]; // first (and only) element

    //   Alert.alert('Prediction', `Predicted label: ${predicted}`);
    // } catch (error) {
    //   console.error('ONNX model error:', error);
    //   Alert.alert('Error', 'Failed to run model. Check console for details.');
    // }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Model" onPress={callModel} />
    </View>
  );
};

export default Model;
