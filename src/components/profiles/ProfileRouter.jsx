import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LearnerProfile from './LearnerProfile';
import MentorProfile from './MentorProfile';
import RecruiterProfile from './RecruiterProfile';

const ProfileRouter = ({ user }) => {
  const { currentUser } = useAuth();
  if (!user) return null;

  // Check if the profile being viewed belongs to the current user
  const isOwnProfile = currentUser && currentUser.uid === user.uid;

  const role = user.role?.toLowerCase() || 'learner'; // Default to learner if no role is specified

  // Render appropriate profile based on user role
  switch (role) {
    case 'mentor':
      return <MentorProfile user={user} isOwnProfile={isOwnProfile} />;
    case 'recruiter':
      return <RecruiterProfile user={user} isOwnProfile={isOwnProfile} />;
    case 'learner':
    default:
      return <LearnerProfile user={user} isOwnProfile={isOwnProfile} />;
  }
};

export default ProfileRouter;