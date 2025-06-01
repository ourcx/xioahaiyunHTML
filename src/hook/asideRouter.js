
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter();

    const navigateToImg = (index) => {
      if (index === 0) {
        router.push({
          path: '/img'
        });
      }
    };

    return {
      navigateToImg,
    };
  }
};
