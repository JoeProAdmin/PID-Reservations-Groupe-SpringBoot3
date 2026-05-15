import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ value, onChange, readOnly = false, size = "1rem" }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: "inline-flex", gap: "2px" }}>
      {stars.map((s) => {
        const active = (hover || value) >= s;
        return (
          <i
            key={s}
            className={`fas fa-star`}
            style={{
              color: active ? "#fec810" : "#dee2e6",
              cursor: readOnly ? "default" : "pointer",
              fontSize: size,
            }}
            onMouseEnter={() => !readOnly && setHover(s)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange && onChange(s)}
          />
        );
      })}
    </div>
  );
};

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

const Comments = ({ spectacleId }) => {
  const { token, userId } = useAuth();
  const currentUserId = userId ? parseInt(userId) : null;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [contenu, setContenu] = useState("");
  const [note, setNote] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Traduction : { [commentId]: { translatedText, targetLang, provider } | null }
  const [translations, setTranslations] = useState({});
  const [translatingId, setTranslatingId] = useState(null);
  const [targetLang, setTargetLang] = useState("en");

  const fetchComments = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/api/spectacles/${spectacleId}/commentaires`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [spectacleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const myComment = useMemo(
    () => comments.find((c) => c.userId === currentUserId),
    [comments, currentUserId]
  );

  const averageNote = useMemo(() => {
    if (comments.length === 0) return null;
    const sum = comments.reduce((acc, c) => acc + (c.note || 0), 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const startEditing = () => {
    if (myComment) {
      setContenu(myComment.contenu);
      setNote(myComment.note);
      setEditingId(myComment.id);
    } else {
      setContenu("");
      setNote(5);
      setEditingId("new");
    }
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setContenu("");
    setNote(5);
    setFormError(null);
  };

  const submit = () => {
    if (!contenu.trim()) {
      setFormError("Le commentaire ne peut pas être vide.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    const isUpdate = editingId !== "new";
    const url = isUpdate
      ? `${API_URL}/api/commentaires/${editingId}`
      : `${API_URL}/api/spectacles/${spectacleId}/commentaires`;
    const method = isUpdate ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contenu: contenu.trim(), note }),
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Erreur lors de l'envoi");
        setSubmitting(false);
        cancelEditing();
        fetchComments();
      })
      .catch((err) => {
        setFormError(err.message);
        setSubmitting(false);
      });
  };

  const deleteComment = (id) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    fetch(`${API_URL}/api/commentaires/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        fetchComments();
      })
      .catch((err) => alert(err.message));
  };

  const translateComment = (commentId, text) => {
    setTranslatingId(commentId);
    fetch(`${API_URL}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Erreur de traduction");
        setTranslations({
          ...translations,
          [commentId]: {
            translatedText: data.translatedText,
            targetLang: data.targetLang,
            detectedSourceLang: data.detectedSourceLang,
            provider: data.provider,
          },
        });
        setTranslatingId(null);
      })
      .catch((err) => {
        alert("Erreur de traduction : " + err.message);
        setTranslatingId(null);
      });
  };

  const hideTranslation = (commentId) => {
    const copy = { ...translations };
    delete copy[commentId];
    setTranslations(copy);
  };

  if (loading) {
    return <div className="info-label">Chargement des avis...</div>;
  }
  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="info-label mb-0">
            {comments.length} avis
            {averageNote && (
              <span className="ms-3">
                <StarRating value={Math.round(averageNote)} readOnly />
                <span className="ms-2 info-value">{averageNote}/5</span>
              </span>
            )}
          </p>
        </div>
        {token ? (
          editingId === null && (
            <button
              onClick={startEditing}
              className="btn btn-primary btn-sm text-uppercase btn-admin"
            >
              <i className="fas fa-pen me-2"></i>
              {myComment ? "Modifier mon avis" : "Laisser un avis"}
            </button>
          )
        ) : (
          <Link to="/login" className="btn btn-outline-warning btn-sm text-uppercase">
            <i className="fas fa-sign-in-alt me-2"></i>Se connecter pour commenter
          </Link>
        )}
      </div>

      {editingId !== null && (
        <div className="rep-card mb-4">
          {formError && (
            <div className="alert-error mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {formError}
            </div>
          )}
          <p className="info-label mb-1">Votre note</p>
          <div className="mb-3">
            <StarRating value={note} onChange={setNote} size="1.5rem" />
          </div>
          <p className="info-label mb-1">Votre avis</p>
          <textarea
            className="form-control mb-3"
            rows="4"
            maxLength="2000"
            placeholder="Partagez votre expérience..."
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
          <div className="d-flex gap-2 justify-content-end">
            <button onClick={cancelEditing} className="btn-cancel">
              Annuler
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="btn btn-primary text-uppercase btn-admin"
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Envoi...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  {editingId === "new" ? "Publier" : "Mettre à jour"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="info-label">Aucun avis pour le moment. Soyez le premier !</p>
      ) : (
        <>
          {/* Sélecteur global de langue cible pour les traductions */}
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <span className="info-label mb-0">
              <i className="fas fa-language me-1 text-warning"></i>
              Traduire les avis vers :
            </span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="form-select form-select-sm"
              style={{ width: "auto", maxWidth: "200px" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex flex-column gap-3">
            {comments.map((c) => {
              const tr = translations[c.id];
              return (
                <div key={c.id} className="rep-card">
                  <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                    <div>
                      <p className="info-value mb-1">
                        <i className="fas fa-user-circle me-2 text-warning"></i>
                        {c.userPrenom} {c.userNom}
                      </p>
                      <StarRating value={c.note} readOnly />
                    </div>
                    <div className="text-end">
                      <p className="info-label mb-1">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {c.updatedAt && (
                          <span className="ms-2" style={{ fontStyle: "italic" }}>
                            (modifié)
                          </span>
                        )}
                      </p>
                      <div className="d-flex gap-2 justify-content-end flex-wrap">
                        {!tr ? (
                          <button
                            onClick={() => translateComment(c.id, c.contenu)}
                            disabled={translatingId === c.id}
                            className="btn btn-outline-primary btn-sm"
                            style={{ fontSize: "0.75rem" }}
                            title="Traduire ce commentaire"
                          >
                            {translatingId === c.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Traduction...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-language me-1"></i>
                                Traduire
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => hideTranslation(c.id)}
                            className="btn btn-outline-secondary btn-sm"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <i className="fas fa-eye-slash me-1"></i>
                            Masquer la traduction
                          </button>
                        )}
                        {c.userId === currentUserId && (
                          <button
                            onClick={() => deleteComment(c.id)}
                            className="btn btn-outline-danger btn-sm"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <i className="fas fa-trash me-1"></i>Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-description mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {c.contenu}
                  </p>

                  {tr && (
                    <div
                      className="mt-3 p-3"
                      style={{
                        background: "#f0f8ff",
                        borderLeft: "4px solid #0d6efd",
                        borderRadius: "4px",
                      }}
                    >
                      <p className="info-label mb-1">
                        <i className="fas fa-language me-1 text-primary"></i>
                        Traduction (
                        {LANGUAGES.find((l) => l.code === tr.targetLang)?.label || tr.targetLang}
                        {tr.detectedSourceLang && tr.detectedSourceLang !== tr.targetLang && (
                          <> · détecté : {tr.detectedSourceLang.toUpperCase()}</>
                        )}
                        ) · <em>via {tr.provider}</em>
                      </p>
                      <p
                        className="text-description mb-0"
                        style={{ whiteSpace: "pre-wrap", fontStyle: "italic" }}
                      >
                        {tr.translatedText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
