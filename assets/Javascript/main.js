
const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)



const cd = $('.cd')
const cdWidth = cd.offsetWidth
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const ramdombtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const PLAYER_STOREGE_KEY = 'F8_PLAYER'












const app = {

    cunrrentIndex: 0,
    isPlaying: false,
    isRamdom : false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOREGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada',
            single: 'Vicetone',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },

        {
            name: 'Summertime',
            single: 'K-391',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },

        {
            name: 'TheFatRat',
            single: '(feat. Laura Brehm)',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg'
        },

        {
            name: 'Reality',
            single: 'Lost Frequencies feat. Janieck Devy',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg'
        },

        {
            name: 'Sóng gió',
            single: 'Jack-Kicm',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg'
        },

        {
            name: 'Despacito',
            single: 'Luis Fonsi',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg'
        },

        {
            name: 'Dance Monkey',
            single: 'Tones And I',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg'
        },

        {
            name: 'SEE YOU AGAIN',
            single: 'Wiz - Khalifa',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg'
        },

        {
            name: 'Attention',
            single: 'Charlie Puth',
            path: './assets/music/song9.mp3',
            image: './assets/img/img9.jpg'
        },


        {
            name: 'Way Back Home',
            single: 'SHAUN',
            path: './assets/music/song10.mp3',
            image: './assets/img/img10.jpg'
        },


   


    ],

    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOREGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const _this = this
       const htmls = this.songs.map((song, index) => {
        return `

         <div class="song ${index === this.cunrrentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                    <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.single}</p>
                    </div>
                <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
       </div>
        `
       })

       playlist.innerHTML = htmls.join('')
    },

    defineproperties: function() {
        Object.defineProperty(this, 'currentSong', {
           get: function() {
            return this.songs[this.cunrrentIndex]
           }
        })
    },


    handleEvent: function() {
       const _this = this

        // sử lý cd quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // sử lý phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
            
        }
        // khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const propressPersent = Math.floor(audio.currentTime / audio.duration * 100)

                progress.value = propressPersent
            }
        }

       // sử lý tua song

       progress.oninput = function(e) {
          const seekTime = audio.duration / 100 * e.target.value

          audio.currentTime = seekTime
       },

       // khi next song
       nextBtn.onclick = function() {
        if(_this.isRamdom) {
            _this.playRandomSong()
        }else (
            _this.nextSong()            
        )
        audio.play()
        _this.render()
        _this.scrollTopActiveSong()
       },
       // khi prev song
       prevBtn.onclick = function() {
        if(_this.isRamdom) {
            _this.playRandomSong()
        }else (
            _this.prevSong()            
        )
         audio.play()
        _this.render()
        _this.scrollTopActiveSong()
       },
       // random song
       ramdombtn.onclick = function(e) {
         _this.isRamdom = !_this.isRamdom
         _this.setconfig('isRamdom', _this.isRamdom)
         ramdombtn.classList.toggle('active', _this.isRamdom)
       },

       // xử lý lặp lại 1 bài hát
       repeatBtn.onclick = function(e) {
          _this.isRepeat = !_this.isRepeat
          _this.setconfig('isRepeat', _this.isRepeat)         
          repeatBtn.classList.toggle('active', _this.isRepeat)
       },
       // xử lý next song khi audio ended

       audio.onended = function() {

        if(_this.isRepeat) {
            audio.play()
        }else {
           nextBtn.click()
        }
       },
       // lang ghe hanh vi click vao llist
       playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')
          if(songNode || e.target.closest('.option')) { 

            if(songNode) {
                _this.cunrrentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()

            }
          }

          if(e.target.closest('.option')) {

          }
       }
    },

    loadCurrentSong: function() {
       

       heading.textContent = this.currentSong.name
       cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
       audio.src = this.currentSong.path
    },
     // loadConfig
    loadConfig: function() {
         this.isRamdom = this.config.isRamdom
         this.isRepeat = this.config.isRepeat
    },

    scrollTopActiveSong: function() {
      setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block:'center'
        })
      }, 500)
    },

    
    nextSong: function() {
       this.cunrrentIndex++
       if(this.cunrrentIndex >= this.songs.length) {
        this.cunrrentIndex = 0
       }

       this.loadCurrentSong()
    },

    prevSong: function() {
        this.cunrrentIndex--
        if(this.cunrrentIndex < 0) {
         this.cunrrentIndex = this.songs.length -1
        }
 
        this.loadCurrentSong()
     },
     playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.cunrrentIndex)

       this.cunrrentIndex = newIndex
       this.loadCurrentSong()
     },
    start: function() {

      this.loadConfig()

       // render lại danh sách bài hát
      this.render()

      // định nghĩa các thuộc tính cho object
      this.defineproperties()


      // lắng nghe sử lý các sự kiện (DOM event)
      this.handleEvent()
    

      // tải thông tin bài hát đầu tiên
      this.loadCurrentSong()

      // hien thi trang thai
      ramdombtn.classList.toggle('active', this.isRamdom)
      repeatBtn.classList.toggle('active', this.isRepeat)
    },
   
}

app.start()



