import React from 'react';
import './EditProfileModal.css'; 

function EditProfileModal({
  step,
  setStep,
  setIsEditing,
  handleSaveProfile,
  bioInput,
  setBioInput,
  locationInput,
  setLocationInput,
  selectedFile,
  setSelectedFile,
  selectedBanner,
  setSelectedBanner,
  userProfile,
  getImageUrl,
  bannerBg
}) {
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box">
        
        <div className="profile-modal-header">
          <button onClick={() => setIsEditing(false)} className="profile-modal-close">✕</button>
          <span className="profile-modal-step-indicator">Passo {step} de 4</span>
          <button 
            onClick={() => {
              if (step < 4) setStep(step + 1);
              else handleSaveProfile();
            }}
            className="profile-modal-next-btn"
          >
            {step === 4 ? 'Done' : 'Next'}
          </button>
        </div>

        <div className="profile-modal-body">
          {/* Passo 1: Avatar */}
          {step === 1 && (
            <div className="profile-modal-step-content">
              <h2>Pick a profile picture</h2>
              <p>Have a favorite selfie? Upload it now.</p>
              <div className="profile-avatar-upload-box">
                {selectedFile ? (
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="profile-avatar-img" 
                  />
                ) : userProfile?.avatar ? (
                  <img 
                    src={getImageUrl(userProfile.avatar)} 
                    alt="Current" 
                    className="profile-avatar-img" 
                  />
                ) : (
                  <span>👤</span>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="profile-avatar-input-file" 
                />
              </div>
            </div>
          )}

          {/* Passo 2: Banner / Header */}
          {step === 2 && (
            <div className="profile-modal-step-content">
              <h2>Pick a header</h2>
              <p>People who visit your profile will see it. Show your style.</p>
              <div 
                className="profile-banner-upload-box"
                style={{
                  backgroundImage: selectedBanner 
                    ? `url(${URL.createObjectURL(selectedBanner)})` 
                    : bannerBg
                }}
              >
                <div className="profile-banner-camera-icon">
                  📷
                </div>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedBanner(e.target.files[0]);
                    }
                  }}
                  className="profile-avatar-input-file" 
                />
              </div>
            </div>
          )}

          {/* Passo 3: Bio */}
          {step === 3 && (
            <div>
              <div className="profile-modal-step-content profile-text-left">
                <h2>Describe yourself</h2>
                <p>What makes you special?</p>
              </div>
              <div className="profile-input-group">
                <label>Your bio</label>
                <textarea 
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={160}
                  rows={4}
                  placeholder="Fale um pouco sobre você..."
                />
                <div className="profile-input-counter">{bioInput.length} / 160</div>
              </div>
            </div>
          )}

          {/* Passo 4: Location */}
          {step === 4 && (
            <div>
              <div className="profile-modal-step-content profile-text-left">
                <h2>Where do you live?</h2>
                <p>Find accounts in the same location as you.</p>
              </div>
              <div className="profile-input-group">
                <label>Location</label>
                <input 
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  maxLength={30}
                  placeholder="Ex: São Paulo, Brasil"
                />
                <div className="profile-input-counter">{locationInput.length} / 30</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EditProfileModal;