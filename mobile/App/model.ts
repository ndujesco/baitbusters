import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import RNFS from 'react-native-fs';
import { showToast } from './const';

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

  if (probability > 0.8) {
    showToast(`Phishing(${probability}): ${text}`);
    return 1
  } else if (probability < 0.5) {
    showToast(`Not phishing: ${text}`);
    return 0
  } else {
    showToast(`Unsure: ${text}`);
    return 0.5
  }

}


console.log(checkPhishing("They have one category for 500k laidis dor pipeops"))