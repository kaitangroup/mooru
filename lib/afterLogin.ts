import { wpFetch } from '@/lib/wpApi';



export const syncGuestSavedToServer = async () => {

    const getToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('wpToken');
      };
      
      const isLoggedIn = () => !!getToken();
      
      const getGuestSaved = (): number[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem('guestSavedExperts');
        return data ? JSON.parse(data) : [];
      };
      
      const setGuestSaved = (ids: number[]) => {
        localStorage.setItem('guestSavedExperts', JSON.stringify(ids));
      };
    
    const token = getToken();
    if (!token) return;
  
    const guestSaved = getGuestSaved();
    if (!guestSaved.length) return;
  
    try {
      for (const id of guestSaved) {
        await wpFetch('/wp-json/guroos/v1/save-expert', {
          method: 'POST',
          body: JSON.stringify({ expert_id: id }),
        });
      }
  
      localStorage.removeItem('guestSavedExperts');
    } catch (err) {
      console.error('Sync error:', err);
    }
  };