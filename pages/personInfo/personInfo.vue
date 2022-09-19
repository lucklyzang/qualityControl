<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-modal v-model="sureCancelShow" :content="content" title="确定退出登录?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<ourLoading isFullScreen :active="showLoadingHint" :translateY="50" text="签退中,请稍候···" color="#fff" textColor="#fff"
		 background-color="rgb(143 143 143)" />
		<view class="nav">
			<nav-bar backState="3000" :home="false" bgColor="#2c9af1" fontColor="#FFF" title="个人中心" @backClick="backTo"></nav-bar>
		</view>
		<view class="content-top-area">
			<image></image>
			<view class="content-top-content">
				<view class="user-photo">
					<image :src="juddgeAvatarUrl()">
				</view>
				<view class="user-message">
					<view class="user-name">
						{{userName}}
					</view>
					<view class="account-name">
						{{accountName}}
					</view>
				</view>
			</view>
		</view>
		<view class="content-bottom-area">
			<view class="content-top-other">
				<view class="left">
					<text>
						<u-icon name="arrow-left" color="#000" size="30"></u-icon>
					</text>
					<text>入职时间</text>
				</view>
				<view class="right">
					<text>
						无
					</text>
				</view>
			</view>
			<view class="content-top-other">
				<view class="left">
					<text>
						<u-icon name="arrow-left" color="#000" size="30"></u-icon>
					</text>
					<text>手机号码</text>
				</view>
				<view class="right">
					<text>
						无
					</text>
				</view>
			</view>
			<view class="content-top-other">
				<view class="left">
					<text>
						<u-icon name="arrow-left" color="#000" size="30"></u-icon>
					</text>
					<text>账号过期时间</text>
				</view>
				<view class="right">
					<text>
						无
					</text>
				</view>
			</view>
			<view class="content-top-other">
				<view class="left">
					<text>
						<u-icon name="arrow-left" color="#000" size="30"></u-icon>
					</text>
					<text>文件查看</text>
				</view>
				<view class="right">
					<text>
						<u-icon name="arrow-right" color="#000" size="30"></u-icon>
					</text>
				</view>
			</view>
			<view class="content-top-other">
				<view class="left">
					<text>
						<u-icon name="arrow-left" color="#000" size="30"></u-icon>
					</text>
					<text>用户角色</text>
				</view>
				<view class="right">
					<text>
						无
					</text>
				</view>
			</view>
		</view>
		<view class="content-bottom">
			<view class="quit-account" @click="isLoginOut">退 出 账 号</view>
			<view class="app-version">
				<text>当前版本</text>
				<text>
					{{`V${versionNumber}`}}
				</text>
			</view>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import {
		userSignOut
	} from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				content: '',
				versionNumber: '1.8',
				sureCancelShow: false,
				showLoadingHint: false
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
				'userInfo',
				'selectHospitalList'
			]),
			userName() {
				return this.userInfo.name
			},
			proId() {
				return this.userInfo.hospitalList.length > 1 ? this.selectHospitalList[0].id : this.userInfo.hospitalList[0].id
			},
			proName() {
				return this.userInfo.hospitalList.length > 1 ? this.selectHospitalList[0].value : this.userInfo.hospitalList[0].name
			},  
			workerId() {
				return this.userInfo.id
			},
			depName() {
				return this.userInfo.depName
			},
			accountName() {
				return this.userInfo.account
			}
		},
		mounted() {
			console.log('信息',this.userInfo)
		},
		methods: {
			...mapMutations([
				'changeOverDueWay'
			]),

			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/qualityPackage/pages/qualityManagement/index/index'
				})
			},

			// 判断头像
			juddgeAvatarUrl() {
				return '/static/img/default-person.jpg'
			},

			isLoginOut() {
				this.sureCancelShow = true
			},
			// 弹框确定事件
			sureCancel() {
				this.showLoadingHint = true;
				this.changeOverDueWay(true);
				setCache('storeOverDueWay', true);
				userSignOut().then((res) => {
					if (res && res.data.code == 200) {
						removeAllLocalStorage();
						uni.redirectTo({
							url: '/pages/login/login'
						})
					} else {
						this.$refs.uToast.show({
							title: `${res.data.msg}`,
							type: 'warning'
						});
						this.changeOverDueWay(false);
						setCache('storeOverDueWay', false)
					};
					this.showLoadingHint = false
				}).
				catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'warning'
					});
					this.changeOverDueWay(false);
					setCache('storeOverDueWay', false);
					this.showLoadingHint = false
				})
			},

			// 弹框取消事件
			cancelSure() {}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";

	.content-box {
		@include content-wrapper;
		.content-top-area {
			position: relative;
			width: 100%;
			margin: 0 auto;
			background: blue;
			height: 140px;
			>image {
				height: 100%;
				position: absolute;
				top: 0;
				left: 0
			};
			.content-top-content {
				margin-left: 20px;
				height: 140px;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				.user-photo {
					width: 55px;
					height: 55px;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				};
				.user-message {
					margin-left: 16px;
					color: #fff;
					.user-name {
						font-size: 16px
					};
					.account-name {
						font-size: 14px
					}
				}
			}
		};
		.content-bottom-area {
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
			background: #fff;
			margin-top: -20px;
			z-index: 10000;
			height: auto;
			font-size: 14px;
			.content-top-otherone {
				height: 100px
			}

			;

			.content-top-other {
				height: 45px;
				line-height: 45px;
				box-sizing: border-box;
				position: relative;
				.left {
					position: absolute;
					left: 0;
					top: 0;
					> text {
						color: $color-text-right;
						&:first-child {
							padding-left: 20px;
							margin-right: 10px
						}
					}
				};
				.right {
						position: absolute;
						right: 20px;
						top: 0;
						> text {
							color: $color-text-right;
							padding-left: 20px;
						}
				}
			}
		}

		;

		.content-bottom {
			flex: 1;
			margin: 0 auto;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			font-size: 13px;
			position: relative;

			.app-version {
				height: 45px;
				background: #fff;
				line-height: 45px;
				text-align: center;
				box-sizing: border-box;
				margin: 30px 0 10px 0;
				>text {
					&:first-child {
						margin-right: 10px;
					};
					color: $color-text-left;
				}
			}

			;
			.quit-account {
				height: 45px;
				width: 260px;
				font-size: 16px;
				margin: 0 auto;
				line-height: 45px;
				background: linear-gradient(to right, #6cd2f8, #2390fe);
				color: #fff;
				border-radius: 20px;
				font-weight: bold;
				text-align: center
			}
		}
	}
</style>
