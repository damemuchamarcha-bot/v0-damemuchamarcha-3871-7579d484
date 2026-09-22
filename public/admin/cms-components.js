// 1. Componente para Spotify (Embeds de canciones, álbumes o playlists)
CMS.registerEditorComponent({
  id: "spotify",
  label: "Spotify Embed",
  fields: [
    {
      name: "url",
      label: "Enlace o URL de Spotify",
      widget: "string",
      hint: "Ejemplo: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"
    }
  ],
  pattern: /^<iframe src="https:\/\/open\.spotify\.com\/embed\/(track|album|playlist)\/([a-zA-A0-9]+)".*><\/iframe>$/,
  fromBlock: function(match) {
    return {
      url: `https://open.spotify.com/${match[1]}/${match[2]}`
    };
  },
  toBlock: function(obj) {
    if (!obj.url) return "";
    const embedUrl = obj.url.replace("open.spotify.com/", "open.spotify.com/embed/");
    return `<iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  },
  toPreview: function(obj) {
    if (!obj.url) return "";
    const embedUrl = obj.url.replace("open.spotify.com/", "open.spotify.com/embed/");
    return `<iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  }
});

// 2. Componente para Instagram (Posts o Reels)
CMS.registerEditorComponent({
  id: "instagram",
  label: "Instagram Post",
  fields: [
    {
      name: "url",
      label: "URL de la publicación de Instagram",
      widget: "string",
      hint: "Ejemplo: https://www.instagram.com/p/C_EXAMPLE/"
    }
  ],
  pattern: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([^/?#&]+)/,
  fromBlock: function(match) {
    return {
      url: match[0]
    };
  },
  toBlock: function(obj) {
    if (!obj.url) return "";
    // Aseguramos que termine con la ruta de embed
    const cleanUrl = obj.url.split('?')[0].replace(/\/$/, "");
    return `<iframe src="${cleanUrl}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  },
  toPreview: function(obj) {
    if (!obj.url) return "";
    const cleanUrl = obj.url.split('?')[0].replace(/\/$/, "");
    return `<iframe src="${cleanUrl}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }
});

// 3. Componente para Galería de Imágenes
CMS.registerEditorComponent({
  id: "gallery",
  label: "Galería de Imágenes",
  fields: [
    {
      name: "images",
      label: "Imágenes de la Galería",
      widget: "list",
      field: { label: "Imagen", name: "image", widget: "image" }
    }
  ],
  pattern: /^<div class="cms-gallery">(.*?)<\/div>$/s,
  fromBlock: function(match) {
    return {
      images: []
    };
  },
  toBlock: function(obj) {
    if (!obj.images || !obj.images.length) return "";
    const imgTags = obj.images.map(img => `<img src="${img}" alt="Imagen de galería" />`).join('\n  ');
    return `<div class="cms-gallery">\n  ${imgTags}\n</div>`;
  },
  toPreview: function(obj) {
    if (!obj.images || !obj.images.length) return "";
    const imgTags = obj.images.map(img => `<img src="${img}" style="width: 100px; height: 100px; object-fit: cover; margin: 4px; border-radius: 4px;" />`).join('');
    return `<div style="display: flex; flex-wrap: wrap;">${imgTags}</div>`;
  }
});
