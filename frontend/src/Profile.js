import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import EditProfileModal from './EditProfileModal';
import api from './services/api';

function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);
  const [bioInput, setBioInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const isMyProfile = !id;

  const fetchProfileAndPosts = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const profileEndpoint = id 
        ? `users/${id}/profile/` 
        : 'users/update/';

      const [profileResponse, postsResponse] = await Promise.all([
        api.get(profileEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('posts/', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUserProfile(profileResponse.data);
      setPosts(postsResponse.data);

      const activeUsername = profileResponse.data.username || profileResponse.data.user;
      if (activeUsername && isMyProfile) {
        localStorage.setItem('username', activeUsername);
      }

      if (profileResponse.data.id) {
        localStorage.setItem('userId', profileResponse.data.id);
      }

      setBioInput(profileResponse.data.bio || '');
      setLocationInput(profileResponse.data.location || '');
      
      let targetId = id || profileResponse.data.id || localStorage.getItem('userId');
      
      if (targetId) {
        fetchFollowersList(targetId, token);
        fetchFollowingList(targetId, token);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      setLoading(false);
    }
  };

  const fetchFollowersList = async (targetId, token) => {
    try {
      const response = await api.get(`users/${targetId}/followers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowersList(response.data);
    } catch (error) {
      console.error("Erro ao buscar seguidores:", error);
    }
  };

  const fetchFollowingList = async (targetId, token) => {
    try {
      const response = await api.get(`users/${targetId}/following/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowingList(response.data);
    } catch (error) {
      console.error("Erro ao buscar quem segue:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfileAndPosts();
    setActiveTab('posts');
  }, [id]);

  const handleToggleFollow = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await api.post(`users/${id}/follow/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.followers_count !== undefined) {
        setUserProfile(prev => ({
          ...prev,
          is_following: response.data.is_following,
          followers_count: response.data.followers_count
        }));
      } else {
        fetchProfileAndPosts();
      }
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      
      formData.append('bio', bioInput !== undefined ? bioInput : (userProfile?.bio || ''));
      formData.append('location', locationInput !== undefined ? locationInput : (userProfile?.location || ''));
      
      if (selectedFile) formData.append('avatar', selectedFile);
      if (selectedBanner) formData.append('banner', selectedBanner);

      const response = await api.patch('users/update/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUserProfile(prev => ({ ...prev, ...response.data }));
      setSelectedFile(null);
      setSelectedBanner(null);
      setIsEditing(false);
      setStep(1);
      fetchProfileAndPosts();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return <div className="profile-loading">Carregando...</div>;
  }

  const currentUsername = userProfile?.username || "Usuário";
  const currentHandle = userProfile?.handle || currentUsername.toLowerCase();

  const postsCount = posts.filter(
    (post) => post.username === currentUsername || post.user === currentUsername
  ).length;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `https://projetofinalclonedox.onrender.com${imagePath}`;
  };

  const bannerBg = selectedBanner 
    ? `url(${URL.createObjectURL(selectedBanner)})` 
    : userProfile?.banner 
    ? `url(${getImageUrl(userProfile.banner)})` 
    : 'none';

  return (
    <div className="profile-container">
      
      <nav className="profile-sidebar">
        <div className="profile-logo">🐦</div>
        <ul>
          <li onClick={() => navigate('/home')}>Home</li>
          <li onClick={() => navigate('/profile')} className={isMyProfile ? "active" : ""}>Profile</li>
          <li onClick={() => navigate('/follow')}>Follow</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      <main className="profile-timeline">
        
        <div className="profile-header">
          <button onClick={() => navigate('/home')} className="profile-back-btn">←</button>
          <div className="profile-header-info">
            <h2>{currentUsername}</h2>
            <span>{postsCount} posts</span>
          </div>
        </div>

        <div 
          className="profile-banner"
          style={{ backgroundImage: bannerBg }}
          onClick={() => {
            if (isMyProfile) document.getElementById('bannerInputDirect').click();
          }}
        >
          {isMyProfile && (
            <input 
              type="file" 
              id="bannerInputDirect" 
              className="profile-hidden-input" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedBanner(e.target.files[0]);
                }
              }}
            />
          )}

          <div className="profile-avatar-container" onClick={(e) => e.stopPropagation()}>
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Avatar" className="profile-avatar-img" />
            ) : userProfile?.avatar ? (
              <img src={getImageUrl(userProfile.avatar)} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">👤</div>
            )}
          </div>
        </div>

        <div className="profile-action-container">
          {isMyProfile ? (
            <button onClick={() => { setStep(1); setIsEditing(true); }} className="set-up-profile-btn">
              Edit profile
            </button>
          ) : (
            <button 
              onClick={handleToggleFollow} 
              className="set-up-profile-btn" 
            >
              {userProfile?.is_following ? 'Seguindo' : 'Seguir'}
            </button>
          )}
        </div>

        <div className="profile-info-section">
          <h1 className="profile-display-name">{currentUsername}</h1>
          <div className="profile-handle">@{currentHandle}</div>

          {userProfile?.bio && <div className="profile-bio">{userProfile.bio}</div>}
          {userProfile?.location && <div className="profile-location">📍 {userProfile.location}</div>}

          <div className="profile-joined">
            📅 Joined {userProfile?.date_joined || "August 2026"}
          </div>

          <div className="profile-stats">
            <div onClick={() => setActiveTab('following')} className="profile-stat-item">
              <strong>{userProfile?.following_count || followingList.length || 0}</strong> <span>Following</span>
            </div>
            <div onClick={() => setActiveTab('followers')} className="profile-stat-item">
              <strong>{userProfile?.followers_count || followersList.length || 0}</strong> <span>Followers</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <div 
            className={`profile-tab-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </div>
          <div 
            className={`profile-tab-item ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </div>
          <div 
            className={`profile-tab-item ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </div>
        </div>

        <div className="profile-tab-content">
          {activeTab === 'posts' && (
            <div className="user-posts-list">
              {posts
                .filter(p => p.username === currentUsername || p.user === currentUsername)
                .map(post => (
                  <div key={post.id} className="post-item">
                    <p>{post.content}</p>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="followers-list">
              {followersList.length > 0 ? (
                followersList.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="profile-user-card"
                  >
                    <span>👤</span>
                    <div>
                      <strong>{user.username}</strong>
                      <div className="profile-user-handle">@{user.username.toLowerCase()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="profile-empty-text">Nenhum seguidor encontrado.</p>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="following-list">
              {followingList.length > 0 ? (
                followingList.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="profile-user-card"
                  >
                    <span>👤</span>
                    <div>
                      <strong>{user.username}</strong>
                      <div className="profile-user-handle">@{user.username.toLowerCase()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="profile-empty-text">Não está seguindo ninguém.</p>
              )}
            </div>
          )}
        </div>

      </main>

      {isEditing && isMyProfile && (
        <EditProfileModal 
          step={step}
          setStep={setStep}
          setIsEditing={setIsEditing}
          handleSaveProfile={handleSaveProfile}
          bioInput={bioInput}
          setBioInput={setBioInput}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          selectedBanner={selectedBanner}
          setSelectedBanner={setSelectedBanner}
        />
      )}
    </div>
  );
}

export default Profile;