<template>
	<view class="container">
		<view class="top-title">
			<text>质量管理系统</text>
		</view>
		<view class="center-image">
			<image :src="bootImgPng"></image>
		</view>
		<view class="environment-state">
			<text>测试环境</text>
		</view>
		<view class="bottom-image">
			<image :src="projectLogoPng"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
		components: {
			faIcon
		},
		data() {
			return {
				qualityClass: '',
				bootImgPng: require("@/static/img/boot-img.png"),
				projectLogoPng: require("@/static/img/boot-page-logo.png")
			}
		},
		onReady() {
		},
		computed: {
			...mapGetters([
			])
		},
		mounted() {
			setTimeout(() => {uni.redirectTo({
					url: '/pages/login/login'
				})},2000)
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex'
			])
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";

	.container {
		@include content-wrapper;
		font-size: 14px;
		.top-title {
			height: 30vh;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 18px;
			color: #101010
		};
		.center-image {
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 59%
			}
		};
		.environment-state {
			height: 18vh;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			color: #9E9E9A
		};
		.bottom-image {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 60px;
				height: 14px
			}
		}
	}
</style>

