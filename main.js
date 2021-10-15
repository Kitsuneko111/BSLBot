const Discord = require('discord.js')
const client = new Discord.Client()
const request = require('request')
const {token} = require('./config.json')

client.once('ready', () => {
    console.log('logged in')
    client.user.setActivity('BSL help', {type:'LISTENING'})
})

const createEmbed = (title, url, member, body) => {
    let embed = new Discord.RichEmbed()
    embed.setTitle(title)
    embed.setAuthor(member.nickname||member.user.username, member.user.avatarURL)
    embed.setURL(url)
    embed.setColor('eded00')
    if(body){
        urls = body.split('"')
        vid = urls.find(val => val.includes('https://'))
        console.log(vid)
        embed.attachFile(vid)
    } else {
        embed.attachFile(url)
    }
    embed.setFooter('All results come directly from signbsl.com')
    embed.setTimestamp(Date.now())
    return embed
}

function downloadPage(url){
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if(error) reject(error)
            if(response.statusCode > 300){
                reject(`Invalid status code ${response.statusCode}`)
            }
            if(body.includes('No results')||body.includes('no video found')){
                reject('404 no results')
            }
            resolve(body)
        })
    })
}

client.on('message', async message =>{
    if(message.author.bot) return
    if(message.content == 'BSL invite'){
        client.generateInvite(67497024).then(val => {message.author.send(val).catch(err => message.reply('Please turn on DMs to get an invite!')); message.channel.send('Invite is in your DMs!')})
    }
    if(message.content == 'BSL help'){
        embed = new Discord.RichEmbed()
        embed.setTitle('Help')
        .setColor('eded00')
        .setTimestamp(Date.now())
        .setFooter(`requested by ${message.member.nickname||message.author.username}`)
        .addField('Main Commands:', '<@738356579379708006> <word>\n?<word>\n? <word>')
        .addField('Sub Commands:', 'BSL help\nBSL invite')
        .addField('Hosted locally and therefore will not always be up, contact Timemaster111#8292 for any issues','\u200b')
        message.channel.send(embed)
    }
    if(!message.content.startsWith('<@738356579379708006>')&&!message.content.startsWith('<@!738356579379708006>')&&!message.content.startsWith('?')&&message.guild) return
    content = message.content
    if(message.content.startsWith('?')) content = content.substr(1)
    args = content.split(/ +/)
    if(args.length < 2 && message.guild&&!message.content.startsWith('?')) return message.reply('no phrase given')
    if(message.guild) args.shift()
    url = `https://signbsl.com/sign/${args.join('-').toLowerCase()}`
    downloadPage(url).then(res => {message.channel.send(createEmbed(args.join(' '), url, message.member, res)); /*console.log(res)*/}).catch(error=> {
        console.log(error)
        message.channel.send(createEmbed('Not Found!', 'https://media.signbsl.com/videos/bsl/nf/mp4/Missing.mp4', message.member))})
        
    
})

client.login(token)