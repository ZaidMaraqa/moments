import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useBodyClass(className) {
    const location = useLocation();

    useEffect(() => {
        document.body.className = '';  // Clear out other classes
        document.body.classList.add(className);

        return () => {
            document.body.classList.remove(className);  // Cleanup by removing class on unmount
        };
    }, [className, location]);
}

export default useBodyClass;