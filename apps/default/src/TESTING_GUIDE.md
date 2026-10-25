# 🧪 Vote System Testing Guide

## Quick Test (2 minutes)

### Step 1: Refresh the App
1. **Hard refresh** the browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. You should see a toast message: **"Cleared X old votes that couldn't sync"** (one-time migration)
3. Console should show: `✅ Migration complete - new vote system active`

### Step 2: Vote on 3 Features
1. Swipe **RIGHT** (Yes) on first feature
2. Swipe **LEFT** (No) on second feature  
3. Swipe **UP** (Maybe) on third feature

### Step 3: Check Console Logs
Open browser console (`F12` → Console tab) and verify you see:

```
✅ Vote saved locally: [vote object]
✅ Vote logged directly to project: [Feature Name]
```

**No 404 errors should appear!** ✅

### Step 4: Verify in Taskade Project
1. Open: https://www.taskade.com/d/WGtW77Vk9smeBUvE
2. You should see **3 new tasks** with:
   - ✅ Feature Title
   - ✅ Category (AI Features/Platform/Engagement)
   - ✅ Vote (Yes/No/Maybe)
   - ✅ Timestamp
   - ✅ User Name

---

## Advanced Testing

### Check Vote Status (Console Command)
Type this in the browser console:
```javascript
checkVotes()
```

**Output should show**:
```
📊 Vote System Status:
  Total votes: 3
  Synced: 3
  Unsynced: 0
📋 All votes: [array of vote objects]
```

### Test Admin Panel
1. **Triple-tap** the VeraLogix logo (top-left) fast
2. Admin panel should open showing:
   - Total votes: 3
   - Synced: 3
   - Pending: 0
3. Click **"Download CSV"** → Should download backup file

### Test Offline Mode
1. Open DevTools → Network tab
2. Change dropdown from "No throttling" to **"Offline"**
3. Vote on a feature
4. Toast should still say **"Vote Saved"** ✅
5. Console should show: `✅ Vote saved locally` and `❌ Direct API failed`
6. Go back **"Online"**
7. Refresh page → Vote should auto-sync

---

## Troubleshooting

### Still seeing 404 errors?
**Solution**: Hard refresh the page (`Ctrl+Shift+R`)
- The migration clears old votes on first load
- After migration, no more 404s should appear

### Votes not appearing in project?
**Check**:
1. Console shows `✅ Vote logged directly to project`?
2. Try `checkVotes()` - are votes marked as `synced: true`?
3. If unsynced, open Admin Panel → Click "Sync Now"

### Admin panel won't open?
**Solution**: Triple-tap faster (within 1 second)
- Alternative: `localStorage.setItem('admin_unlocked', 'true')` then refresh

### Console shows API errors?
**Check response**:
```javascript
// Manual test
fetch('/api/taskade/projects/WGtW77Vk9smeBUvE/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'TEST VOTE',
    fields: {
      '@title': 'TEST',
      '@category': { type: 'Select', optionId: 'cat-ai' },
      '@vote': { type: 'Select', optionId: 'vote-yes' },
      '@timestamp': new Date().toISOString(),
      '@userName': 'Test User'
    }
  })
}).then(r => r.json()).then(console.log)
```

---

## Expected Behavior

### ✅ **WORKING** Signs:
- Toast shows **"Vote Saved"** on every swipe
- Console logs: `✅ Vote logged directly to project`
- No 404 errors after migration
- Votes appear in Taskade project immediately
- Admin panel shows correct sync status

### 🚨 **BROKEN** Signs:
- Toast shows vote but console has errors
- 404 errors persist after hard refresh
- Votes not appearing in project
- Admin panel shows all votes as "unsynced"

---

## Recovery Steps (If Broken)

1. **Clear everything and restart**:
```javascript
// In console
localStorage.clear()
location.reload()
```

2. **Manually sync from backup**:
```javascript
// In console
import { getLocalVotes } from './services/voteBackup'
console.log(getLocalVotes())
```
Then copy the JSON and manually create tasks in Taskade

3. **Contact support** with:
- Screenshot of console errors
- Output from `checkVotes()`
- Admin panel screenshot

---

## Success Criteria

After testing, you should have:
- ✅ No 404 errors in console
- ✅ All votes visible in [Intern Us Innovation Votes](https://www.taskade.com/d/WGtW77Vk9smeBUvE) project
- ✅ Admin panel shows correct statistics
- ✅ CSV export downloads successfully
- ✅ Toast confirmations on every vote

**If all checkboxes pass → System is working! 🎉**
