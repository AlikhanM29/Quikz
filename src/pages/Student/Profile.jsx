import React, { useEffect, useMemo, useState } from "react";
import { getResults, saveUserProfile } from "../../utils/storage";

export default function ProfilePage({ user, setUser, showNotif }) {
  const [myResults, setMyResults] = useState([]);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  useEffect(() => {
    setDisplayName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user?.name, user?.avatar]);

  const nameAliases = useMemo(() => {
    return new Set([user?.name, ...(Array.isArray(user?.previousNames) ? user.previousNames : [])].filter(Boolean));
  }, [user?.name, user?.previousNames]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const resultsData = await getResults();
        const allResults = Array.isArray(resultsData) ? resultsData : [];

        const filteredResults = allResults.filter((result) => {
          const resultUserName = result.userName || result.name || result.student_name;
          return nameAliases.has(resultUserName);
        });

        setMyResults(filteredResults);
      } catch (error) {
        console.error("Failed to load results:", error);
        setMyResults([]);
      }
    };

    loadResults();
  }, [nameAliases]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showNotif?.("Choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      showNotif?.("Name cannot be empty.");
      return;
    }

    const updatedUser = saveUserProfile(user, {
      name: trimmedName,
      avatar,
    });

    setUser(updatedUser);
    showNotif?.("Profile updated.");
  };

  const avatarFallback = (displayName || user?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          background: "var(--surface)",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "40px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--green)",
              background: avatar ? "transparent" : "#17301b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "38px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={displayName || "User avatar"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              avatarFallback
            )}
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <h1 style={{ color: "var(--green)", marginBottom: "8px" }}>{user?.name}</h1>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
              {user?.email} • {user?.role === "teacher" ? "Teacher" : "Student"}
            </p>

            <div
              style={{
                marginBottom: "24px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#111",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Current plan</div>
              <div style={{ fontWeight: "700", color: "white" }}>{user?.currentPlan || "No active plan"}</div>
              {(user?.planPrice || user?.paymentMethod || user?.planStatus) && (
                <div style={{ color: "var(--muted)", fontSize: "0.92rem", marginTop: "6px" }}>
                  {[user?.planPrice, user?.paymentMethod, user?.planStatus].filter(Boolean).join(" • ")}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid var(--border)",
                  color: "white",
                }}
              />

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    background: "#111",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Upload Avatar
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>

                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    style={{
                      padding: "12px 18px",
                      borderRadius: "12px",
                      border: "1px solid #5a1d1d",
                      background: "#1b0f0f",
                      color: "#ff8f8f",
                      cursor: "pointer",
                    }}
                  >
                    Remove Avatar
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-green"
                  onClick={handleSaveProfile}
                  style={{ padding: "12px 22px" }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>My Results</h2>
      <div style={{ marginTop: "20px" }}>
        {myResults.length > 0 ? (
          myResults.map((result, index) => (
            <div
              key={index}
              style={{
                background: "var(--surface)",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <h3 style={{ color: "white" }}>{result.testTitle || result.test || result.test_title}</h3>
                <span style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {result.date || result.test_date}
                </span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--green)" }}>
                {result.score} / {result.total}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--muted)" }}>No completed tests yet.</p>
        )}
      </div>
    </div>
  );
}
