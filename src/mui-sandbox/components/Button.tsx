import Button from '@mui/material/Button';

export default function MuiButton() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" color="error">
        Error
      </Button>
      <Button variant="contained" size="small">
        Small
      </Button>
      <Button variant="contained" size="large">
        Large
      </Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
    </div>
  );
}
