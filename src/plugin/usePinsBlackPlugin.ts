import { unsafeWindow } from '$';
import { globalFetch } from '../hooks/useFetch';
import { addHistoryListener } from '../utils/addHistoryListener';

let apiList = [
  'https://api.juejin.cn/recommend_api/v1/short_msg/recommend', // 最新
  'https://api.juejin.cn/recommend_api/v1/short_msg/hot', // 热门
  'https://api.juejin.cn/recommend_api/v1/short_msg/follow', // 关注
  'https://api.juejin.cn/recommend_api/v1/short_msg/topic', // 圈子
];
let dogAvatarList: string[] = [
  // '/700366d869cb87ac1f10020d713d09b7~',
  // '/469c55692430eb2f737cd6c0d9e31690~',
  // '/3227254b000ad5e103c72b91365dd4a0~',
  // '/dbe68af40bc02e65b8f1ff4a191c1ad8~',
  // '/bc2d29879201f1e960e9916ab444d826~',
  // '/c63d93beaced59e31e4e95574358439a~',
  // '/f0cc7fed696fe81057940d2aa6d2b48a~',
  // '/956a256d35d0804fbdb6d00d841ee1db~',
  // '/845553517fb52fd08021bdfc3081f4f3~',
  // '/84ac40fec3f5afa9e20c151ad4a014c0~',
  // '/e9deae8da606ebb9ae8e0c03034e6000~',
  // '/e82f33fe612f6a1b9ab1894d5aed669c~',
  // '/696e8b6eaf911306703ebcfc833f3d65~',
  // '/de410cb683028c9e4a548b1e481231f8~',
  // '/5ff347dcae63710b83903822be55176c~',
  // '/1f2d87aa8d5d22534ee0f1463468d289~',
  // '/d3265a25dc845acc2e1678a66e7b17c0~',
  // '/0899929271092e72fe79a1574a552b09~',
  // '/59d14d4da16235bc1f1704e7663e27b8~',
  // '/52bd6572e91ec20011a379b4bc94e1f0~',
  // '/1503bfb4f626f093c20ff107b4bda5c2~',
  // '/c553b2fbe32ea1b978c859b4ccfca32c~',
  // '/5c40e9c6c6f73dc341fe180ea42ca1cd~',
  // '/9bf9b9bdff87dd2a83668eadc5de6b8c~',
  // '/78c9837eaf281399ba50bac9af42c508~',
  // '/0d1beb632bbe1578f6f071b147b0a520~',
  // '/ba9e329cdb507596de0ca51b19dd17ca~',
  // '/07dfd7f715846bcb5842cce3cce4787d~',
  // '/4b52fc266b8897c7d80e44b8b2095710~',
  // '/f4fd4405fe6ff84a3b216ad3cd6e9bed~',
  // '/d1b26fd4f4574de36bac80119d7828a9~',
  // '/8c111e0cf5dc48fe5c4e0e7aabf59a47~',
  // '/a32d8710122ca4c32133b05451ec0c5d~',
  // '/e69719ac1dfebe3f82e8f84b98e4843c~',
  // '/8acabd1c7abd59cf51e7f65692a508b6~',
  // '/b0efeec0962c5b603563cf15b00dba60~',
  // '/1f43d5cf6b29d24960b1aa95c3a8ca74~',
  // '/deca41e5359b870c74b82ef3edbb716b~',
  // '/4a532132a3241345164def6a8557351c~',
  // '/6e9ea5e1672271bb2a18da148f57c185~',
  // '/a67f4b4c88389e28bb75e401ae8f502a~',
  // '/cdd8cf2708aa963daff620ec8506ff36~',
  // '/f8c88399bb0698131b6b65012dcb89d7~',
  // '/15f16c7977705272118d7271592b5eca~',
  // '/920162e8babd8a73127c27e9ab71fa12~',
  // '/9526682e4a841bff0d972a829e0e769f~',
  // '/2f78ea26226348e67890f47c3fde025c~',
  // '/f843e09b78ddb7a94d906f78bdf0a8ac~',
  // '/c81d21c0a6a81ae19f80425ee7eda99c~',
  // '/70a87cc699330903862d181f0d66e7f6~',
  // '/e7aae482857618fd2d24cf9f4f9fff96~',
  // '/b70c81f85e3632e9e9e0b7e678c9d94c~',
  // '/844e46c6218a78d5533a10ac2482797e~',
];
let dogAvatarMd5List = [
  'c256a3e53082b303213212bd0c8486bc',
  '6699aa19c4fa9850f118ced85357057e',
  'ceb29bace521ee860f6e3fa5f417d735',
  '5b16d95793785a7d1b2fabc72b7cabc3',
  '7034eeff94f6579cd9621f7c0764a7f6',
  '305be4ec99d7fa24a5d47984f1e3a39d',
  '852054d4d7f63df7db1a2814c12dea8a',
  '29d6a7d686ef5076857817a014bf1e4e',
  '61cd4dd4d96c01bb47b3a8d974a434be',
  'fcbee4eb02c900ec81e78698b1fdf60c',
  'ab5e00ee7f1c60b836f72e815b4f3875',
  'baf3a623bb235c23885be825a68adf8c',
  'ee45d4077fbaf5127189316b12108139',
  'df85d14bd9172c9b6b893ceba86facaf',
  '89ef10a28511c786416e18b0f34fa353',
  'b05a44fd3c980120e18c3666c1ba4e54',
  '81da18fc397516685d4ecb1e096e5bf7',
  'e61253e36a8dee8ec3911e1d14ef7e52',
  'e2a320cea403a70d66d7c0a799d3b19f',
  '95c91d85ae296539cbd9b9dc1fe6eada',
  '56400444c28f0f577c89081614ac0003',
  '0fabda8e776c52686b4cb22075a3265f',
  'f96d4e241a22116446d42c2b223fd9cd',
  '1759d2d2b4268505e29cc85b39bb26e1',
  'b9205f392bf4fb5afe8307225d4b3a12',
];

interface PinsType {
  msg_Info: {
    content: string;
  };
  author_user_info: {
    avatar_large: string;
  };
}
export enum BlackType {
  keyWord = 1,
  dogAvatar = 2,
}
export interface ParmaItem {
  type: BlackType;
  blackList?: string[];
  dogAvatarBlackType?: DogAvatarBlackEnum;
}

export enum DogAvatarBlackEnum {
  disabled = 0,
  normal = 1,
  grow = 2,
}

export let dogAvatarBlackTypeList = [
  {
    value: DogAvatarBlackEnum.disabled,
    label: '关闭',
  },
  {
    value: DogAvatarBlackEnum.normal,
    label: '正常模式',
  },
  {
    value: DogAvatarBlackEnum.grow,
    label: '增强模式',
  },
];

export function usePinsBlackPlugin() {
  let id: number | null = null;
  let growDogAvatarBlack = useGrowDogAvatarBlack();
  growDogAvatarBlack.start();

  return {
    start(parmas: ParmaItem[]) {
      if (id !== null) {
        this.stop();
      }
      id = globalFetch.interceptor.response.use((res) => {
        let apiMatch = apiList.some((v) => {
          return (res.config.input as string).startsWith(v);
        });
        if (apiMatch) {
          res.data.data = res.data.data.filter((v: PinsType) => {
            let state = parmas.some((param) => {
              let blackList = param.blackList || [];
              if (param.type === BlackType.keyWord) {
                return blackList.some((key) => v.msg_Info.content.includes(key));
              } else if (param.type === BlackType.dogAvatar) {
                // console.log(v);
                if (param.dogAvatarBlackType !== DogAvatarBlackEnum.disabled) {
                  let state = [...blackList, ...dogAvatarList].some((blackStr) => {
                    return (v.author_user_info.avatar_large || '').includes(blackStr);
                  });
                  if (state) {
                    // v.author_user_info.avatar_large = '';
                    console.log(234);
                  }
                }
                if (param.dogAvatarBlackType === DogAvatarBlackEnum.grow) {
                  // console.log(123);
                }

                return false;
              }
            });

            return !state;
          });
          return res;
        }
      });
    },
    stop() {
      if (id !== null) {
        globalFetch.interceptor.response.eject(id);
      }
    },
  };
}

function handlePinList(event:Event){
  console.log(event);
  
  // console.dir(dom);
  // let imgList = dom?.querySelectorAll('img.lazy.avatar')
  // console.log(imgList);
}

function useGrowDogAvatarBlack() {
  let status = false;
  let removeHistoryListener: Function;
  return {
    start() {
      if (status) return;
      status = true;
      let handleRouting = function () {
        let dom:HTMLDivElement|null = unsafeWindow.document.querySelector('.pin-list')
        console.log(dom);
        
        dom?.addEventListener('scroll', handlePinList)
        
      };
      handleRouting()
      removeHistoryListener = addHistoryListener(handleRouting);
    },
    stop() {
      if (!status) return;
      status = false;
      removeHistoryListener();
    },
  };
}
