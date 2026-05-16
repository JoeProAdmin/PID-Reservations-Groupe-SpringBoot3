import { useState } from "react";

// ================================================
// Boutons de partage social
// Props :
//   - title : titre a afficher dans le partage
//   - text  : description courte (optionnel)
//   - url   : URL a partager (par defaut window.location.href)
// ================================================
const ShareButtons = ({ title, text = "", url }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || "");
  const encodedText = encodeURIComponent(text || title || "");

  const links = [
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      color: "#1877f2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: "fab fa-x-twitter",
      color: "#000000",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      color: "#25d366",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin-in",
      color: "#0a66c2",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: "fas fa-envelope",
      color: "#6c757d",
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const copyLink = () => {
    if (!navigator.clipboard) {
      // Fallback ancien navigateur
      const tmp = document.createElement("input");
      tmp.value = shareUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Web Share API (mobile principalement) — bouton natif si dispo
  const canNativeShare = typeof navigator !== "undefined" && navigator.share;
  const nativeShare = () => {
    navigator
      .share({ title, text, url: shareUrl })
      .catch(() => {
        // user a annule, on ignore
      });
  };

  return (
    <div className="d-flex gap-2 flex-wrap align-items-center">
      <span className="info-label me-2 mb-0">
        <i className="fas fa-share-alt me-1 text-warning"></i>
        Partager :
      </span>

      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.name === "Email" ? "_self" : "_blank"}
          rel="noopener noreferrer"
          title={`Partager sur ${link.name}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: link.color,
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.9rem",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <i className={link.icon}></i>
        </a>
      ))}

      <button
        onClick={copyLink}
        title="Copier le lien"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: copied ? "#198754" : "#1a1a1a",
          color: "#fec810",
          border: "none",
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "transform 0.15s, background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <i className={`fas fa-${copied ? "check" : "link"}`}></i>
      </button>

      {copied && (
        <small style={{ color: "#198754", fontWeight: 700, fontSize: "0.75rem" }}>
          Lien copié !
        </small>
      )}

      {canNativeShare && (
        <button
          onClick={nativeShare}
          title="Partager via..."
          className="btn btn-sm btn-outline-dark ms-1"
          style={{ fontSize: "0.75rem", borderRadius: "18px" }}
        >
          <i className="fas fa-share me-1"></i>
          Plus
        </button>
      )}
    </div>
  );
};

export default ShareButtons;
