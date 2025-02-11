import { useState, useEffect } from 'react';

export const useActiveSection = () => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const position = window.scrollY + 500;

      sections.forEach((section) => {
        const currentNavLink = document.querySelector(`#${section.id}-link`);
        if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
        ) {
          currentNavLink?.classList.add('active-section');
          setActiveId(section.id);
        } else {
          currentNavLink?.classList.remove('active-section');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    activeId,
  };
}

export default useActiveSection;