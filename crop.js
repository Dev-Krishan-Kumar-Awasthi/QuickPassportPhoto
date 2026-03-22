const sharp = require('sharp');

async function crop() {
  const input = 'c:\\Users\\HP\\Music\\autophoto\\quickpassportphoto_logo_light_1773979392710.png';
  const outPublic = 'c:\\Users\\HP\\Music\\autophoto\\public\\Logo.png';
  const outApp = 'c:\\Users\\HP\\Music\\autophoto\\app\\icon.png';

  try {
    const metadata = await sharp(input).metadata();
    console.log(`Original size: ${metadata.width}x${metadata.height}`);
    
    // Extract central 70% to zoom in perfectly
    const size = Math.floor(Math.min(metadata.width, metadata.height) * 0.70);
    const left = Math.floor((metadata.width - size) / 2);
    const top = Math.floor((metadata.height - size) / 2);

    await sharp(input)
      .extract({ width: size, height: size, left, top })
      .toFile(outPublic);
    
    await sharp(outPublic).toFile(outApp);
    console.log(`Cropped successfully to ${size}x${size}!`);
  } catch (err) {
    console.error('Error cropping:', err);
  }
}

crop();
