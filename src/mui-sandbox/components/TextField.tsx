import TextField from '@mui/material/TextField';

export default function MuiTextField() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <TextField label="Standard" variant="standard" />
      <TextField label="Filled" variant="filled" />
      <TextField label="Outlined" variant="outlined" />
      <TextField label="Disabled" variant="outlined" disabled />
      <TextField label="Error" variant="outlined" error helperText="Something went wrong" />
      <TextField label="Required" variant="outlined" required />
      <TextField
        label="Multiline"
        variant="outlined"
        multiline
        rows={4}
        defaultValue="Default text"
      />
    </div>
  );
}
