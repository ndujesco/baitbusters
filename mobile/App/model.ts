import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import RNFS from 'react-native-fs';

let cachedSession: InferenceSession | null = null;

async function loadModel() {
  if (cachedSession) return cachedSession;

  const modelAssetName = 'multi_lang_phishing_detector.onnx';
  const destinationPath = `${RNFS.CachesDirectoryPath}/${modelAssetName}`;

  try {
    // Copy model from Android assets to cache (required for Android)
    await RNFS.copyFileAssets(modelAssetName, destinationPath);
  } catch (err) {
    console.warn('Model might already be in cache:', err);
  }

  const session = await InferenceSession.create(destinationPath);
  cachedSession = session;
  return session;
}

/**
 * Check if text is phishing/spam.
 * @param text Input text to analyze
 * @returns Probability (0–1) that text is phishing
 */
export async function checkPhishing(text: string): Promise<number> {
  if (!text.trim()) throw new Error('Text input is empty.');

  const session = await loadModel();

  const inputName = session.inputNames[0];
  const outputNames = session.outputNames;

  const inputTensor = new Tensor('string', [text.trim()], [1]);

  const results = await session.run({ [inputName]: inputTensor });

  // Adjust this line based on your model’s output name/index
  const probTensor = results[outputNames[1]];
  const probability = probTensor.data[1] as number;

  if (probability > 0.75) {
    return 1
  } else if (probability < 0.5) {
    return 0
  } else {
    return 0.5
  }

}
