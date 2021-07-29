const botName = process.env.SETTING_BOT_NAME
const dcLink = process.env.DC_LINK

module.exports = {
  prefix: ' ・ ',
  discordLink: ':[Discord]: ・ ' + dcLink,
  fName: '#SetFakeName ・ :[FiBo]',
  joke: ':[Joke]: ・ {joke}',
  resetStarter: ':[Starterkit]: ・ The Starterkit for {user} has been reset.',
  'mine.deact': ' ・ (Mine has been deactivated)',
  'mine.notFound': ' ・ (Mine not found)',
  'firstJoin.m1': ':[Welcome]: ・ Welcome to the Server @{user}!',
  'firstJoin.m2': ':[Welcome]: ・ Open chat with "T" and write "/new" to get started!',
  'vote.day': ':[Voting]: ・ Daytime-Voting begins! (7:00 AM) Press "F2" or "F3" to vote!',
  'vote.night': ':[Voting]: ・ Nighttime-Voting begins! (10:00 PM) Press "F2" or "F3" to vote!',
  'vote.sun': ':[Voting]: ・ Weather voting begins! (Sunny) Press "F2" or "F3" to vote!',
  'pos.idle': '#Teleport -118018 -67506 37011 "' + botName + '"',
  'pos.outside': '#Teleport -117233 -67161 37422 "' + botName + '"',
  'pPos.firstJoin': '#Teleport -115792 -65255 37194 {userID}',
  'pPos.inside': '#Teleport -117653 -67530 37010 {userID}',
  'pPos.outside': '#Teleport -116944 -67169 37010 {userID}',
  'auth.login': ' ・ >> {user} is joining << ・ ',
  'auth.logout': ' ・ >> {user} left << ・ ',
  kill: ':[Killfeed]: ・ >> {user1} {event} {user2} << ・ ',
  'start.reload': ' ・ Reloading...',
  'start.reboot':
    ' ・ I will reboot my PC now. It can take up to 10 minutes untill I’m ready again.',
  'start.ready': ' ・ I’m ready!',
  'whoami.m1': ':[Stats]: ・ Name: {user} | Role: "{group}" | Joined: {date} at {time}',
  'whoami.m2': ':[Stats]: ・ Total logins: {logins} | Total playtime: {playtime} hours',
  'whoami.m3': ':[Stats]: ・ Messages - Local: {local} | Global: {global} | Squad: {squad}',
  'whoami.m4': ':[Stats]: ・ Warnings: Capslock {caps} | Spam - | Rules -',
  'whoami.m5': ':[Stats]: ・ Kills: {kills} (including events and suicides)',
  'schedule.restart.1': '#Announce Restart in 5 minutes!',
  'schedule.restart.2':
    ':[Restart-Info]: ・ Don’t drive and make sure there are no valuable items on the floor!',
  'schedule.restart.3': '#Announce Restart in 1 minute!',
  'schedule.backup':
    ':[Restart-Info]: ・ There will be 2 restarts shortly after each other now. The first one will be at 5:55 and the second at 6:00. The Server should be back online at about 6:03.'
}
