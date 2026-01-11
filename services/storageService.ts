
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import type { FileCategory } from '../App';

/**
 * Uploads a file to Supabase Storage and creates a record in the Supabase Database.
 *
 * @param {File} file - The file to be uploaded.
 * @param {FileCategory} category - The category of the file ('image' or 'pdf').
 * @returns {Promise<string>} A promise that resolves with the public URL of the file.
 */
export const uploadFile = async (file: File, category: FileCategory): Promise<string> => {
  // 1. Generate a unique filename using UUID to prevent collisions.
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;

  // 2. Upload the file to the 'qr-files' public bucket in Supabase Storage.
  const { error: uploadError } = await supabase.storage
    .from('qr-files')
    .upload(uniqueFileName, file);

  if (uploadError) {
    console.error('Supabase Storage Error:', uploadError);
    throw new Error(`Storage error: ${uploadError.message}`);
  }

  // 3. Get the public URL of the newly uploaded file.
  const { data: urlData } = supabase.storage
    .from('qr-files')
    .getPublicUrl(uniqueFileName);

  const publicUrl = urlData.publicUrl;

  if (!publicUrl) {
    throw new Error('Could not get public URL for the uploaded file.');
  }

  // 4. Insert a new record into the 'uploads' table in the Supabase Database.
  const { error: insertError } = await supabase
    .from('uploads')
    .insert({
      file_type: category,
      file_name: uniqueFileName,
      file_url: publicUrl,
      qr_data: publicUrl,
    });

  if (insertError) {
    console.error('Supabase DB Error:', insertError);
    // If the database insert fails, attempt to remove the orphaned file from storage.
    await supabase.storage.from('qr-files').remove([uniqueFileName]);
    throw new Error(`Database error: ${insertError.message}`);
  }

  // 5. Return the public URL, which will be used to generate the QR code.
  console.log(`Successfully uploaded ${uniqueFileName}. URL: ${publicUrl}`);
  return publicUrl;
};
