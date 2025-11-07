# Quick Start Guide - Docker API Spike

## 🚀 5-Minute Demo

### Step 1: Install Dependencies
```bash
cd spikes/docker-api-validation
npm install
```

### Step 2: Verify Docker Connection
```bash
npm run test-connection
```

Expected output:
```
✅ Successfully connected to Docker daemon
   Docker Version: X.X.X
   API Version: 1.XX
```

### Step 3: Run Event Listener (Terminal)
```bash
npm run events
```

This will start monitoring Docker events in your terminal.

### Step 4: Generate Test Events
In a **separate terminal**, run:
```bash
cd spikes/docker-api-validation
./test-events.sh
```

Watch the events appear in real-time in the first terminal!

### Step 5: Browser Demo (Optional)
```bash
node proxy-server.js
```

Then open http://localhost:3001 in your browser.

## 🎯 What Each Script Does

| Script | Purpose |
|--------|---------|
| `test-connection.js` | Validates Docker daemon connection |
| `events-listener.js` | CLI tool for monitoring events |
| `proxy-server.js` | Web-based event monitor with UI |
| `test-events.sh` | Generates sample Docker events |

## 🐛 Troubleshooting

### Error: "connect EACCES /var/run/docker.sock"
**Solution**: Add your user to docker group
```bash
sudo usermod -aG docker $USER
# Then log out and back in
```

### Error: "connect ENOENT /var/run/docker.sock"
**Solution**: Docker is not running
```bash
# Start Docker Desktop (Mac/Windows)
# Or start Docker daemon (Linux):
sudo systemctl start docker
```

### Events not appearing?
**Solution**: Try running a simple Docker command
```bash
docker run --rm alpine echo "test"
```

## 📝 Key Files

- `README.md` - Complete documentation
- `DECISION.md` - Quick decision reference
- `package.json` - Dependencies
- `*.js` - Spike implementation code

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Docker daemon accessible
- [ ] Test connection succeeds
- [ ] Events streaming in terminal
- [ ] Browser demo working
- [ ] Documentation reviewed

## 🎓 Next Steps

After completing this spike:

1. Review `DECISION.md` for recommendations
2. Decide: Real API or Mock events for MVP?
3. If mock events: Record event sequences from spike
4. If real API: Plan backend proxy implementation
5. Build animation system based on event structure

## 📞 Support

This spike validates ILI-93. For questions:
- Review the full `README.md`
- Check Docker Engine API docs
- See example code in spike directory
