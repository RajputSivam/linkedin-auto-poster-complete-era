import { useState } from 'react';
import { uploadFile } from '../services/api';

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadFile(formData);
      setMessage(`Uploaded successfully: ${response.data.url}`);
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">Upload certificates or screenshots</h2>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
        />
        <button onClick={handleUpload} className="rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Upload file
        </button>
      </div>
      {message && <p className="mt-4 text-slate-600">{message}</p>}
    </div>
  );
};

export default UploadSection;
