import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MuiCard() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Card Title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a basic MUI card component. All styling is controlled through the theme.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Action</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

      <Card variant="outlined" sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Outlined Card
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Same card with outlined variant.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained">
            Primary
          </Button>
          <Button size="small" variant="outlined">
            Secondary
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
