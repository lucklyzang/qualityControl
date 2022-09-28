<template>
	<view class="contain" v-show="dialogShow">
		<view class="contain-content">
			<u-icon name="checkmark-circle" :size="iconSize" :color="iconColor"></u-icon>
			<text :style="{'color':iconColor}">{{dialogText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "hintDialog",
		props: {
			dialogText: {
				type: String,
				default: '已评价'
			},
			iconSize: {
				type: Number,
				default: 120
			},
			iconColor: {
				type: String,
				default: "#1864FF"
			},
			durationTime: {
				type: Number,
				default: 2000
			},
			dialogShow: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
			}
		},
		watch: {
			dialogShow () {
				this.showEvent()
			}
		},
		mounted () {
			this.showEvent()
		},
		methods: {
			showEvent () {
				setTimeout(()=> { console.log('关闭'); this.dialogShow = false },this.durationTime)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.contain {
		position: fixed;
		width: 80px;
		height: 120px;
		top: 50%;
		left: 50%;
		z-index: 20000;
		transform: translate(-50%,-50%);
		.contain-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			>text {
				margin-top: 10px;
				font-weight: bold
			}
		}
	}
</style>

