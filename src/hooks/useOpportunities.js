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

// Hook to get a single opportunity
export const useOpportunity = (opportunityId) => {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!opportunityId) {
      setOpportunity(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const opportunityDocRef = doc(db, 'opportunities', opportunityId);

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(opportunityDocRef, 
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const opportunityData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          };
          
          // Get recruiter info
          if (opportunityData.recruiterId) {
            try {
              const userDocRef = doc(db, 'users', opportunityData.recruiterId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                opportunityData.recruiter = {
                  id: userDoc.id,
                  name: userDoc.data().name,
                  companyName: userDoc.data().companyName,
                  profileImage: userDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching opportunity recruiter:', err);
            }
          }
          
          setOpportunity(opportunityData);
        } else {
          setOpportunity(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching opportunity:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [opportunityId]);

  return { opportunity, loading, error };
};

// Hook to get all opportunities, optionally filtered by recruiterId
export const useOpportunities = (recruiterId = null, limit = 10) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let opportunitiesQuery;
    const opportunitiesRef = collection(db, 'opportunities');
    
    if (recruiterId) {
      opportunitiesQuery = query(
        opportunitiesRef, 
        where('recruiterId', '==', recruiterId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    } else {
      opportunitiesQuery = query(
        opportunitiesRef, 
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    }

    const unsubscribe = onSnapshot(
      opportunitiesQuery, 
      async (snapshot) => {
        const opportunitiesPromises = snapshot.docs.map(async (doc) => {
          const opportunityData = {
            id: doc.id,
            ...doc.data()
          };
          
          // Get recruiter info
          if (opportunityData.recruiterId) {
            try {
              const userDocRef = doc(db, 'users', opportunityData.recruiterId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                opportunityData.recruiter = {
                  id: userDoc.id,
                  name: userDoc.data().name,
                  companyName: userDoc.data().companyName,
                  profileImage: userDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching opportunity recruiter:', err);
            }
          }
          
          return opportunityData;
        });
        
        const opportunitiesData = await Promise.all(opportunitiesPromises);
        setOpportunities(opportunitiesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching opportunities:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [recruiterId, limit]);

  return { opportunities, loading, error };
};

// Hook to search opportunities by title, description, or skills required
export const useSearchOpportunities = (searchTerm, limit = 10) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setOpportunities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Normalize search term
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    // Client-side filtering approach
    const fetchAndFilterOpportunities = async () => {
      try {
        const opportunitiesRef = collection(db, 'opportunities');
        const opportunitiesQuery = query(
          opportunitiesRef,
          firestoreLimit(50) // Fetch more to allow for filtering
        );

        const querySnapshot = await getDocs(opportunitiesQuery);
        
        // Filter and get recruiter info
        const opportunitiesPromises = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(opportunity => {
            // Check title match
            if (opportunity.title?.toLowerCase().includes(normalizedSearchTerm) || 
                opportunity.roleTitle?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check description match
            if (opportunity.description?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check company name match
            if (opportunity.companyName?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check location match
            if (opportunity.location?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check skills/tech stack match
            if (opportunity.skills?.some(skill => 
              skill.toLowerCase().includes(normalizedSearchTerm)
            ) || opportunity.techStack?.some(tech => 
              tech.toLowerCase().includes(normalizedSearchTerm)
            )) {
              return true;
            }
            
            return false;
          })
          .map(async (opportunity) => {
            // Get recruiter info
            if (opportunity.recruiterId) {
              try {
                const userDocRef = doc(db, 'users', opportunity.recruiterId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  opportunity.recruiter = {
                    id: userDoc.id,
                    name: userDoc.data().name,
                    companyName: userDoc.data().companyName,
                    profileImage: userDoc.data().profileImage
                  };
                }
              } catch (err) {
                console.error('Error fetching opportunity recruiter:', err);
              }
            }
            
            return opportunity;
          });
          
        const filteredOpportunities = await Promise.all(opportunitiesPromises);
        setOpportunities(filteredOpportunities.slice(0, limit));
        setLoading(false);
      } catch (err) {
        console.error('Error searching opportunities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAndFilterOpportunities();
  }, [searchTerm, limit]);

  return { opportunities, loading, error };
};

export default useOpportunities; 