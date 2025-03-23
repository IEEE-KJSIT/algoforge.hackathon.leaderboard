import { db } from '../firebase';
import { collection, getDocs, query, onSnapshot, doc, getDoc } from 'firebase/firestore';

export interface TeamScore {
  id: string;
  teamName: string;
  projectName: string;
  score: number;
  rank?: number;
}

export class LeaderboardService {
  private leaderboardListeners: (() => void)[] = [];

  // Helper for calculating scores consistently with reports section
  private calculateScoreFromRatings(ratings: any): number {
    if (!ratings || typeof ratings !== 'object' || Object.keys(ratings).length === 0) {
      return 0;
    }

    // Use the same scoring algorithm as the reports section
    let totalScore = 0;
    let ratingCount = 0;

    Object.values(ratings).forEach((rating: any) => {
      if (rating && typeof rating === 'object') {
        const criteriaValues = Object.values(rating).filter(
          value => typeof value === 'number'
        ) as number[];
        
        if (criteriaValues.length > 0) {
          const avgRating = criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length;
          totalScore += avgRating;
          ratingCount++;
        }
      }
    });
    
    // Calculate final score (average of all judge's ratings)
    // Format to single decimal place
    return ratingCount > 0 ? Math.round((totalScore / ratingCount) * 10) / 10 : 0;
  }

  // Get all projects and their scores for the leaderboard
  async getLeaderboardData(): Promise<TeamScore[]> {
    try {
      console.log('Fetching leaderboard data...');
      
      // Try to get real data from Firebase
      try {
        const projectsRef = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsRef);
        
        if (!projectsSnapshot.empty) {
          console.log(`Found ${projectsSnapshot.size} projects in Firebase`);
          
          // Real data fetched from Firebase
          const projectData: TeamScore[] = [];
          
          for (const docSnap of projectsSnapshot.docs) {
            const project = docSnap.data();
            console.log(`Processing project: ${project.teamName || 'Unknown'}`);
            
            // Calculate score using the shared helper method
            const score = this.calculateScoreFromRatings(project.ratings);
            console.log(`Calculated score for ${project.teamName}: ${score}`);
            
            projectData.push({
              id: docSnap.id,
              teamName: project.teamName || 'Unknown Team',
              projectName: project.projectName || 'Unnamed Project',
              score: score
            });
          }
          
          // Sort by score and add rank
          const rankedData = projectData
            .sort((a, b) => b.score - a.score)
            .map((team, index) => ({
              ...team,
              rank: index + 1
            }));
            
          console.log('Ranked data ready', rankedData);
          return rankedData;
        }
      } catch (err) {
        console.error('Error fetching from Firebase, falling back to mock data:', err);
      }
      
      // If we reach here, we'll use mock data
      console.log('Using mock leaderboard data');
      const mockData: TeamScore[] = [
        { id: '1', teamName: 'Code Warriors', projectName: 'AI Fitness Coach', score: 9.5 },
        { id: '2', teamName: 'Byte Busters', projectName: 'Smart Irrigation System', score: 9.2 },
        { id: '3', teamName: 'Quantum Coders', projectName: 'AR Navigation App', score: 8.9 },
        { id: '4', teamName: 'Digital Nomads', projectName: 'Sustainability Tracker', score: 8.5 },
        { id: '5', teamName: 'Tech Titans', projectName: 'Mental Health Bot', score: 8.3 },
        { id: '6', teamName: 'Algorithm Aces', projectName: 'Blockchain Voting', score: 8.1 },
        { id: '7', teamName: 'Neural Ninjas', projectName: 'Pollution Monitor', score: 7.8 },
        { id: '8', teamName: 'Pixel Pirates', projectName: 'Virtual Reality Museum', score: 7.5 },
        { id: '9', teamName: 'Data Demons', projectName: 'Stock Market Predictor', score: 7.2 },
        { id: '10', teamName: 'Binary Bandits', projectName: 'Audio Transcription Tool', score: 7.0 },
      ];
      
      // Sort teams by score in descending order and assign ranks
      return mockData
        .sort((a, b) => b.score - a.score)
        .map((team, index) => ({
          ...team,
          rank: index + 1
        }));
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  }

  // Start listening for real-time updates to projects collection
  setupRealTimeLeaderboard(onUpdate: (teams: TeamScore[]) => void): () => void {
    try {
      console.log('Setting up real-time leaderboard listener...');
      
      // Create a query against the projects collection
      const projectsRef = collection(db, 'projects');
      
      // Set up real-time listener with includeMetadataChanges to ensure we catch all updates
      const unsubscribe = onSnapshot(projectsRef, 
        { includeMetadataChanges: true },
        (snapshot) => {
          console.log(`Snapshot update with ${snapshot.docChanges().length} changes`);
          
          if (snapshot.metadata.hasPendingWrites) {
            console.log('Has local pending changes, waiting for commit');
            return; // Don't process until the write is committed
          }
          
          const projectData: TeamScore[] = [];
          
          snapshot.forEach((docSnap) => {
            const project = docSnap.data();
            
            // Calculate score using the shared helper method
            const score = this.calculateScoreFromRatings(project.ratings);
            
            projectData.push({
              id: docSnap.id,
              teamName: project.teamName || 'Unknown Team',
              projectName: project.projectName || 'Unnamed Project',
              score: score
            });
          });
          
          // Log the changes
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            console.log(`Change type: ${change.type} for team: ${data.teamName}, current score: ${this.calculateScoreFromRatings(data.ratings)}`);
          });
          
          // Sort by score and add rank
          const rankedData = projectData
            .sort((a, b) => b.score - a.score)
            .map((team, index) => ({
              ...team,
              rank: index + 1
            }));
          
          console.log('Updated ranked data ready', rankedData);
          
          // Invoke callback with updated data
          onUpdate(rankedData);
        },
        (error) => {
          console.error('Error in leaderboard listener:', error);
        }
      );
      
      // Save listener reference for cleanup
      this.leaderboardListeners.push(unsubscribe);
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time leaderboard:', error);
      return () => {}; // Return empty function if setup fails
    }
  }

  // Clean up any active listeners when component unmounts
  cleanup() {
    console.log('Cleaning up all leaderboard listeners');
    this.leaderboardListeners.forEach(unsubscribe => unsubscribe());
    this.leaderboardListeners = [];
  }
} 