import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function ImageLightbox({ src, alt, onClose }) {
  const { t } = useTranslation();
  return (
    <Dialog open={Boolean(src)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 0, bgcolor: 'black', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <IconButton
          onClick={onClose}
          aria-label={t('common.close')}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
        >
          <Close />
        </IconButton>
        {src && (
          <Box
            component="img"
            src={src}
            alt={alt}
            sx={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', display: 'block' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
