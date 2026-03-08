import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export const BreadcrumbHeader = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link to="/">Inicio</Link>
      {parts.map((part, idx) => (
        <Typography key={part + idx} color="text.primary">{part}</Typography>
      ))}
    </Breadcrumbs>
  );
};
