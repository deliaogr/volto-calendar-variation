import React from 'react';

export const useMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = React.useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  return {
    openMenu,
  };
};
