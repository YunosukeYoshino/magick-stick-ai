import React, { useState, useCallback, useEffect } from 'react';
import { generateYamlPrompt, generateNewImage, generateCharacterSheet } from './services/geminiService';
import { YAML_GENERATION_PROMPT } from './constants';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { CopyIcon, SparklesIcon, WandIcon, PersonIcon, ResetIcon, ImageIcon } from './components/Icons';

// Helper function to convert a data URL to a File object
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

const STORAGE_KEY = 'characterSheetGeneratorData';

const App: React.FC = () => {
  const [referenceImage, setReferenceImage] = useState<{ file: File | null; previewUrl: string } | null>(null);
  const [generatedYaml, setGeneratedYaml] = useState<string | null>(null);
  const [isYamlLoading, setIsYamlLoading] = useState(false);
  const [characterSheet, setCharacterSheet] = useState<string | null>(null);
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const [newPosePrompt, setNewPosePrompt] = useState<string>('笑顔で手を振る');
  const [compositionImage, setCompositionImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; text: string | null } | null>(null);
  const [isNewImageLoading, setIsNewImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { referenceImagePreviewUrl, generatedYaml, characterSheetUrl } = JSON.parse(savedData);
        if (referenceImagePreviewUrl) {
          // We don't have the file, but we have the preview URL for display
          setReferenceImage({ file: null, previewUrl: referenceImagePreviewUrl });
        }
        if (generatedYaml) {
          setGeneratedYaml(generatedYaml);
        }
        if (characterSheetUrl) {
          setCharacterSheet(characterSheetUrl);
        }
      }
    } catch (e) {
      console.error("Failed to load saved data:", e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    handleStartOver(false); // Clear old state but not storage yet
    setReferenceImage({ file, previewUrl: URL.createObjectURL(file) });
    setGeneratedYaml(null);
    setCharacterSheet(null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleCompositionImageUpload = (file: File) => {
    setCompositionImage({ file, previewUrl: URL.createObjectURL(file) });
  };


  const handleGenerateYaml = useCallback(async () => {
    if (!referenceImage?.file) return;
    setError(null);
    setGeneratedYaml(null);
    setCharacterSheet(null);
    setIsYamlLoading(true);
    try {
      const yaml = await generateYamlPrompt(referenceImage.file, YAML_GENERATION_PROMPT);
      setGeneratedYaml(yaml);
      // Save state
      const dataToSave = {
        referenceImagePreviewUrl: referenceImage.previewUrl,
        generatedYaml: yaml,
        characterSheetUrl: null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during YAML generation.');
      console.error(err);
    } finally {
      setIsYamlLoading(false);
    }
  }, [referenceImage]);
  
  const handleGenerateSheet = useCallback(async () => {
    if (!generatedYaml || !referenceImage?.file) return;
    setError(null);
    setGeneratedImage(null);
    setIsSheetLoading(true);
    try {
        const sheetImageUrl = await generateCharacterSheet(referenceImage.file, generatedYaml);
        setCharacterSheet(sheetImageUrl);
        // Save state
        const dataToSave = {
            referenceImagePreviewUrl: referenceImage.previewUrl,
            generatedYaml: generatedYaml,
            characterSheetUrl: sheetImageUrl
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during character sheet generation.');
        console.error(err);
    } finally {
        setIsSheetLoading(false);
    }
  }, [generatedYaml, referenceImage]);

  const handleGenerateNewImage = useCallback(async () => {
    if (!characterSheet || !newPosePrompt) return;
    setError(null);
    setGeneratedImage(null);
    setIsNewImageLoading(true);
    try {
      const characterSheetFile = await dataUrlToFile(characterSheet, 'character-sheet.png');
      const result = await generateNewImage(characterSheetFile, newPosePrompt, compositionImage?.file);
      if (result.image) {
        setGeneratedImage({ url: result.image, text: result.text });
      } else {
        throw new Error('The AI did not return an image. It might have returned text instead: ' + result.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
      console.error(err);
    } finally {
      setIsNewImageLoading(false);
    }
  }, [characterSheet, newPosePrompt, compositionImage]);

  const handleCopy = () => {
    if (generatedYaml) {
      navigator.clipboard.writeText(generatedYaml);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleStartOver = (clearStorage = true) => {
    if (clearStorage) {
        localStorage.removeItem(STORAGE_KEY);
    }
    setReferenceImage(null);
    setGeneratedYaml(null);
    setCharacterSheet(null);
    setGeneratedImage(null);
    setCompositionImage(null);
    setError(null);
    setNewPosePrompt('笑顔で手を振る');
  };

  const renderWorkflow = () => {
    if (characterSheet) {
      return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel: Reference Sheet */}
          <section aria-labelledby="reference-sheet-heading">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 sticky top-8">
              <h2 id="reference-sheet-heading" className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">✓</span>基準となる立ち絵
              </h2>
              <div className="aspect-w-4 aspect-h-3 bg-gray-900 rounded-lg overflow-hidden">
                <img src={characterSheet} alt="Generated Character Sheet" className="w-full h-full object-contain" />
              </div>
               <p className="text-sm text-gray-400 mt-4">この立ち絵を基準に、新しいポーズや表情を生成します。</p>
            </div>
          </section>

          {/* Right Panel: New Image Generation */}
          <section aria-labelledby="new-image-heading">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
              <h2 id="new-image-heading" className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">4.</span>新しい画像を生成
              </h2>
              <p className="text-gray-400 mb-6">立ち絵・参考画像・テキストを組み合わせて、キャラクターの新しい画像を生成します。</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
                    <ImageIcon />
                    <span className="ml-2">構図・ポーズ参考画像 (任意)</span>
                  </h3>
                  <p className="text-gray-400 mb-3 text-sm">
                    キャラクターに取らせたいポーズや構図の参考となる画像をアップロードできます。
                  </p>
                  <ImageUploader onImageUpload={handleCompositionImageUpload} previewUrl={compositionImage?.previewUrl} />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
                      <WandIcon />
                      <span className="ml-2">テキストで指示</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={newPosePrompt}
                      onChange={(e) => setNewPosePrompt(e.target.value)}
                      placeholder="例：笑顔で手を振る"
                      className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    />
                    <button
                      onClick={handleGenerateNewImage}
                      disabled={isNewImageLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                    >
                      {isNewImageLoading ? <Loader /> : <SparklesIcon />}
                      <span className="ml-2">{isNewImageLoading ? '生成中...' : '新しい画像を生成'}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {isNewImageLoading && <div className="mt-4 text-center text-pink-400">AIが新しい画像を生成中です...</div>}
              {generatedImage && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">生成結果:</h3>
                  <img src={generatedImage.url} alt="Generated character" className="rounded-lg shadow-lg max-w-full mx-auto" />
                  {generatedImage.text && <p className="mt-4 p-4 bg-gray-900/50 rounded-lg text-gray-400 italic">{generatedImage.text}</p>}
                </div>
              )}
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-8">
        {/* Step 2: YAML Generation */}
        <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <span className="text-3xl mr-3">2.</span>設定用プロンプトを生成
          </h2>
          <p className="text-gray-400 mb-4">アップロードした画像からキャラクター設定を抽出し、画像生成用のYAMLプロンプトを作成します。</p>
          <button
            onClick={handleGenerateYaml}
            disabled={isYamlLoading || !referenceImage?.file}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
          >
            {isYamlLoading ? <Loader /> : <WandIcon />}
            <span className="ml-2">{isYamlLoading ? '生成中...' : 'YAMLプロンプトを生成'}</span>
          </button>
          {isYamlLoading && <div className="mt-4 text-center text-purple-400">AIがキャラクターの特徴を分析中です...</div>}
          {generatedYaml && (
            <div className="mt-6 relative">
              <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-96"><code>{generatedYaml}</code></pre>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors" aria-label="Copy YAML to clipboard">
                {copySuccess ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon />}
              </button>
            </div>
          )}
        </section>
        
        {/* Step 3: Character Sheet Generation */}
        {generatedYaml && (
            <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                    <span className="text-3xl mr-3">3.</span>キャラクターの全身立ち絵を生成
                </h2>
                <p className="text-gray-400 mb-4">生成されたYAMLプロンプトを基に、キャラクターの正面・背面・側面を含むリファレンスシートを作成します。</p>
                <button
                    onClick={handleGenerateSheet}
                    disabled={isSheetLoading || !referenceImage?.file}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                >
                    {isSheetLoading ? <Loader /> : <PersonIcon />}
                    <span className="ml-2">{isSheetLoading ? '生成中...' : '全身立ち絵を生成'}</span>
                </button>
                {isSheetLoading && <div className="mt-4 text-center text-teal-400">AIが立ち絵を生成中です。これには数分かかることがあります...</div>}
            </section>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            キャラクター設定 AIアシスタント
          </h1>
          <p className="text-lg text-gray-400">キャラクター画像をアップロードして、設定資料の作成や新しいポーズの生成をしよう</p>
          <button
              onClick={() => handleStartOver(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
              title="Start Over"
          >
              <ResetIcon />
              <span>最初からやり直す</span>
          </button>
        </header>

        <main>
          {!characterSheet && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">1.</span>参照画像をアップロード
              </h2>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={referenceImage?.previewUrl} />
            </div>
          )}

          {referenceImage && renderWorkflow()}

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg max-w-4xl mx-auto">
              <h3 className="font-bold">エラーが発生しました</h3>
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;