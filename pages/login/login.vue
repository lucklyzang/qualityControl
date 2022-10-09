<template>
	<view class="container">
		<u-toast ref="uToast" />
		<u-modal v-model="chooseHospitalShow" width="90%" :zoom="false" :show-title="false" 
		:mask-close-able="true" @confirm="chooseHospitalEvent"
		>
			<view class="slot-content">
				<view>
					<xfl-select 
						:list="hospitalList"
						:showItemNum="8"
						 @change="hosipitalChange"
						 @clear="hosipitalClear"
						placeholder = "请选择医院"
						:selectHideType="'hideAll'"
					>
					</xfl-select>
				</view>
			</view>
		</u-modal>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="登录中,请稍候···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="modalShow" :content="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="container-content">
			<image :src="loginBackgroundPng"></image>
			<view class="title">
				<view>
					<image :src="projectLogoPng"></image>
				</view>
				<view>
					<text>质 量 管 理 系 统</text>
				</view>
      </view>
			<view class="form-box">
				<u-form :model="form" ref="uForm">
					<u-form-item left-icon="account-fill" :left-icon-style="{'font-size':'20px','color': '#BBBBBB'}">
						<u-input v-model="form.username" placeholder="请输入账号"/>
					</u-form-item>
					<u-form-item left-icon="lock-fill" :left-icon-style="{'font-size':'20px','color': '#BBBBBB'}">
						<u-input v-model="form.password" placeholder="请输入密码" type="password"/>
					</u-form-item>
				</u-form>
			</view>
      <view class="remember-password">
        <view class="remember-password-content">
          <u-checkbox-group @change="checkboxGroupChange">
                <u-checkbox 
                  @change="checkboxChange"
                  shape="circle"
                  active-color="#289E8E"
                  v-model="item.checked" 
                  v-for="(item, index) in list" :key="index" 
                  :name="item.name"
                >{{item.name}}</u-checkbox>
            </u-checkbox-group>
         </view>
      </view>
			<view class="form-btn">
				<button type="primary" @click="sure">登 录</button>
			</view>
      <!-- <view class="weixin-login">
        <u-divider border-color="#6d6d6d" color="#333">微信授权登陆</u-divider>
        <view class="image-wrapper" @click="weixinLoginEvent">
          <image src="/static/img/weixin.png">
        </view>
      </view> -->
      <!-- <view class="bottom-character">
        <text>内部系统,仅限医护进行下单使用</text>
      </view> -->
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import {logIn} from '@/api/login.js'
	import xflSelect from '@/components/xfl-select/xfl-select.vue';
	import { setCache, getCache, removeCache } from '@/common/js/utils'
	export default {
	components: {
		xflSelect
	 },
		data() {
			return {
				chooseHospitalShow: false,
				selectHospitalList: [],
				loginBackgroundPng: require("@/static/img/login-background.png"),
				projectLogoPng: require("@/static/img/project-logo.png"),
				hospitalList: [],
				form: {
					username: '',
					password: ''
				},
        list: [
          {
            name: '记住账户密码',
            checked: false,
            disabled: false
          }
        ],
				modalShow: false,
				modalContent: '',
				showLoadingHint: false
			}
		},
		onReady () {
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		mounted () {
			this.form.username = getCache('userName') ? getCache('userName') : '';
			this.form.password = getCache('userPassword') ? getCache('userPassword') : '';
		},
		methods: {
			...mapMutations([
				'storeUserInfo',
				'changeOverDueWay',
				'changeSelectHospitalList',
				'changePermissionInfo',
				'changeRoleNameList'
			]),
      
      // 选中某个复选框时，由checkbox时触发
      checkboxChange(e) {
        console.log(this.list);
      },
      
      // 选中任一checkbox时，由checkbox-group触发
      checkboxGroupChange(e) {
        // console.log(e);
      },
			
			// 医院下拉框下拉选择确定事件
			hosipitalChange (val) {
				this.selectHospitalList = [];
				this.selectHospitalList.push(val.orignItem);
				this.changeSelectHospitalList(this.selectHospitalList);
				setCache('selectHospitalList',this.selectHospitalList)
			},
			
			// 医院下拉框下拉清除事件
			hosipitalClear () {
				this.selectHospitalList = []
			},
			
			// 医院下拉框下拉确定事件
      chooseHospitalEvent () {
				if (this.selectHospitalList.length == 0) {
					this.chooseHospitalShow = true
					this.$refs.uToast.show({
						title: '请选择医院',
						type: 'warning'
					})
				} else {
					uni.navigateTo({
						url: '/qualityPackage/pages/qualityManagement/index/index'
					})
				}
			},
				 
			// 账号密码事件
			sure () {
				let loginMessage = {
				  username: this.form.username,
				  password: this.form.password
				};
				this.showLoadingHint = true;
				logIn(loginMessage).then((res) => {
					if (res) {
					  if (res.data.code == 200) {
						   this.changeOverDueWay(false);
						   setCache('storeOverDueWay',false); 
							// 登录用户名密码及用户信息存入Locastorage
              // 判断是否勾选记住用户名密码
              if (this.list[0]['checked']) {
                setCache('userName', this.form.username);
                setCache('userPassword', this.form.password);
              } else {
                removeCache('userName', this.form.username);
                removeCache('userPassword', this.form.password);
              };
							setCache('userInfo', res.data.data.worker);
							setCache('roleNameList', res.data.data.roleNameList);
							setCache('permissionInfo', res.data.data.authorities);
							setCache('isLogin', true);
							this.storeUserInfo(res.data.data.worker);
							this.changePermissionInfo(res.data.data.authorities);
							this.changeRoleNameList(res.data.data.roleNameList);
							if (this.userInfo.hospitalList.length > 1) {
								this.hospitalList = [];
								this.selectHospitalList = [];
								for (let item of this.userInfo.hospitalList) {
									this.hospitalList.push({
										value: item.name,
										id: item.id
									})
								};
								this.chooseHospitalShow = true
							} else {
								uni.navigateTo({
									url: '/qualityPackage/pages/qualityManagement/index/index'
								})
							}
					  } else {
						 this.modalShow = true;
						 this.modalContent = `${res.msg}`
					  }
					};
					this.showLoadingHint = false;
				  })
				  .catch((err) => {
					   this.showLoadingHint = false;
					   this.modalShow = true;
					   this.modalContent = `${err}`
				  })
			},
      
      // 微信授权登录事件
      weixinLoginEvent () {
        uni.redirectTo({
            url: '/pages/weixinLogin/weixinLogin'
        })
      },
			
			// 弹框确定事件
			sureCancel () {},
			
			// 弹框取消事件
			cancelSure () {}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		font-size: 14px;
		/deep/ .u-model {
			position: relative;
			box-sizing: border-box;
			overflow: auto !important;
			.u-model__content {
				.slot-content {
					height: 300px;
					.show-box {
						.list-container {
							top: 0;
							.list {
								.item {
									color: #a8a8a8
								};
								.active {
									color: #01a6ff;
								}
							}
						}
					}
				}
			};
			.u-model__footer__button {
				color: #43c3f4 !important
			}
		};
		.container-content {
			flex: 1;
			background: #fff;
			position: relative;
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 80vh
			}
			.title {
				width: 100%;
				height: 58vh;
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				color: black;
				font-size: 26px;
        color: #fff;
        font-weight: bold;
        >view {
					z-index: 1000;
					&:first-child {
						margin-top: -80px;
						margin-bottom: 8px;
						width: 135px;
						height: 30px;
						 image {
							 width: 100%;
							 height: 100%
						 }
					};
					&:last-child {
						margin-left: -6px;
						font-size: 16px;
					}
				}
			};
			.form-box {
        width: 90%;
        margin: 0 auto;
				padding: 10px;
				/deep/ .u-input {
					background: #fff
				}
				text {
					display: inline-block;
					margin-bottom: 8px
				}
				.form-account {
				}
				.form-password {
					margin-top: 20px
				}
			}
      .remember-password {
        width: 100%;
        margin: 0 auto;
        height: 40px;
        position: relative;
        .remember-password-content {
          position: absolute;
          top: 0;
          right: 20px;
					::v-deep .u-checkbox-group{
						.u-checkbox {
							.u-checkbox__label {
								color: #565656 !important;
								font-weight: 14px !important
							}
						}
					}
        }
      }
			.form-btn {
        width: 70%;
        margin: 0 auto;
        margin-top: 30px;
				::after {
					border-radius: 4px;
					border: none;
				};
				button {
          background-image: linear-gradient(to right, #6ED3F7 , #218FFF);
					box-shadow: 0px 2px 6px 0 rgba(36,149,213,1);
					line-height: 48px;
          border-radius: 30px;
				}
			}
      .weixin-login {
        width: 100%;
        margin: 0 auto;
        margin-top: 40px;
        .image-wrapper {
          width: 60px;
          height: 50px;
          margin: 0 auto;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
      .bottom-character {
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        bottom: 10px;
        color: #333;
        text {
          font-size: 12px;
          border-left: 1px solid #333;
          border-right: 1px solid #333;
          padding: 0 6px
        }
      }
		}
	}
</style>
