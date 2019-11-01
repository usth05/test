var audioTP, audioTP1;

function audioInit($elbox, audioUrl) {
	if(!audioUrl) {
		return
	}
	$($elbox).html('');
	var html = `<div class="myAudioLeft">
						<img class="audioImg" src="./img/voice.png" />
						<audio class="audio" src="` + audioUrl + `"></audio>
					</div>
					<div class="myAudioRight">
						<span class="startTime">00:00</span>
						<div class="rangeBox">
							<div class="rangeRed">
								<p class="range" id="range"></p>
							</div>
						</div>
						<span class="endTime">00:00</span>
					</div>`;
	$($elbox).append(html);
	$(".myAudio .myAudioLeft .audio").each(function(audio, index, audios) {
		var $this = $(this)[0];
		if($this != null) {
			var duration = '00:00';
			$this.load();
			$this.oncanplay = function() {
				var duration = timeChange($this.duration)
				$($this).parents(".myAudio").find(".endTime").html(duration)
			}
		}
	});
	$(document).on("click", ".audioImg", function() {
		if(audioTP) {
			clearInterval(audioTP);
		}
		if(audioTP1) {
			clearInterval(audioTP1);
		}
		if($(this).hasClass("play")) {
			$(this).removeClass("play").attr("src", "./img/voice.png").siblings('.audio')[0].pause();
		} else {
			$(".audioImg").each(function() {
				$(this).removeClass("play").attr("src", "./img/voice.png").siblings('.audio')[0].pause();
			})
			$(this).addClass("play").attr("src", "./img/voice.gif").siblings('.audio')[0].play();
			timeMove(this);
			dragMove(this);
		}
	});
}

//时间处理 
function timeChange(time) { //默认获取的时间是时间戳改成我们常见的时间格式
	if(isNaN(time)) {
		return "00:00"
	}
	//分钟
	var minute = time / 60;
	var minutes = parseInt(minute);
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	//秒
	var second = time % 60;
	seconds = parseInt(second);
	if(seconds < 10) {
		seconds = "0" + seconds;
	}
	var allTime = "" + minutes + "" + ":" + "" + seconds + ""
	return allTime
};
//时间变动
function timeMove($el) {
	var that = this;
	var $audio = $($el).siblings('.audio')[0];
	var currentTime = $audio.currentTime;
	var duration = $audio.duration;
	var currentTime1 = timeChange(currentTime);
	$($el).parents(".myAudio").find(".startTime").html(currentTime1);
	audioTP = setInterval(function() {
		var currentTime = $audio.currentTime;
		var currentTime1 = timeChange(currentTime);
		$($el).parents(".myAudio").find(".startTime").html(currentTime1);
		if(currentTime >= duration) {
			$($el).removeClass("play").attr("src", "./img/voice.png").siblings('.audio')[0].pause();
			$($el).parents(".myAudio").find(".rangeRed").width('100%');
			clearInterval(audioTP);
			clearInterval(audioTP1);
		}
	}, 1000);
}
//滑块移动
function dragMove($el) {
	var $audio = $($el).siblings('.audio')[0];
	var rangeBox = $($el).parents(".myAudio").find(".rangeBox");
	var duration = $audio.duration;
	audioTP1 = setInterval(function() {
		width = ($audio.currentTime / duration) * (parseInt(rangeBox.width()));
		$($el).parents(".myAudio").find(".rangeRed").width(width);
	}, 100);
};