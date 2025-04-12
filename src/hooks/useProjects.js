import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  onSnapshot,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../firebase';

// Hook to get a single project
export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const projectDocRef = doc(db, 'projects', projectId);

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(projectDocRef, 
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const projectData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          };
          
          // Get creator info
          if (projectData.creatorId) {
            try {
              const userDocRef = doc(db, 'users', projectData.creatorId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                projectData.creator = {
                  id: userDoc.id,
                  name: userDoc.data().name,
                  profileImage: userDoc.data().profileImage,
                  role: userDoc.data().role
                };
              }
            } catch (err) {
              console.error('Error fetching project creator:', err);
            }
          }
          
          setProject(projectData);
        } else {
          setProject(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching project:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  return { project, loading, error };
};

// Hook to get all projects, optionally filtered by userId (creator)
export const useProjects = (userId = null, limit = 10) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let projectsQuery;
    const projectsRef = collection(db, 'projects');
    
    if (userId) {
      projectsQuery = query(
        projectsRef, 
        where('creatorId', '==', userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    } else {
      projectsQuery = query(
        projectsRef, 
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    }

    const unsubscribe = onSnapshot(
      projectsQuery, 
      async (snapshot) => {
        const projectsPromises = snapshot.docs.map(async (projectDoc) => {
          const projectData = {
            id: projectDoc.id,
            ...projectDoc.data()
          };
          
          // Get creator info
          if (projectData.creatorId) {
            try {
              const userDocRef = doc(db, 'users', projectData.creatorId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                projectData.creator = {
                  id: userDoc.id,
                  name: userDoc.data().name,
                  profileImage: userDoc.data().profileImage,
                  role: userDoc.data().role
                };
              }
            } catch (err) {
              console.error('Error fetching project creator:', err);
            }
          }
          
          return projectData;
        });
        
        const projectsData = await Promise.all(projectsPromises);
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, limit]);

  return { projects, loading, error };
};

// Hook to search projects by title, description, or technologies
export const useSearchProjects = (searchTerm, userId = null, limit = 10) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // If search term is empty, just set empty results but keep the hook executing
    if (!searchTerm || searchTerm.trim() === '') {
      setProjects([]);
      setLoading(false);
      return;
    }

    // Normalize search term
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    // We use a client-side filtering approach
    const fetchAndFilterProjects = async () => {
      try {
        let projectsQuery;
        const projectsRef = collection(db, 'projects');
        
        if (userId) {
          projectsQuery = query(
            projectsRef, 
            where('creatorId', '==', userId),
            firestoreLimit(50) // Fetch more to allow for filtering
          );
        } else {
          projectsQuery = query(
            projectsRef,
            firestoreLimit(50) // Fetch more to allow for filtering
          );
        }

        const querySnapshot = await getDocs(projectsQuery);
        
        // Get project creator info
        const projectsPromises = querySnapshot.docs
          .map(projectDoc => ({
            id: projectDoc.id,
            ...projectDoc.data()
          }))
          .filter(project => {
            // Check title match
            if (project.name?.toLowerCase().includes(normalizedSearchTerm) || 
                project.title?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check description match
            if (project.description?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check technologies match
            if (project.technologies?.some(tech => 
              tech.toLowerCase().includes(normalizedSearchTerm)
            )) {
              return true;
            }
            
            return false;
          })
          .map(async (project) => {
            // Get creator info
            if (project.creatorId) {
              try {
                const userDocRef = doc(db, 'users', project.creatorId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  project.creator = {
                    id: userDoc.id,
                    name: userDoc.data().name,
                    profileImage: userDoc.data().profileImage,
                    role: userDoc.data().role
                  };
                }
              } catch (err) {
                console.error('Error fetching project creator:', err);
              }
            }
            
            return project;
          });
          
        const filteredProjects = await Promise.all(projectsPromises);
        setProjects(filteredProjects.slice(0, limit));
        setLoading(false);
      } catch (err) {
        console.error('Error searching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAndFilterProjects();
  }, [searchTerm, userId, limit]);

  return { projects, loading, error };
};

export default useProjects; 