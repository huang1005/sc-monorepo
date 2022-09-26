import { ref } from "vue";

const rcThree = ref("");

const useRenderlayout = () => {
  return (
    <>
      <div class="rs-element">
        <div class="rs-element__box" ref="rcThree"></div>
        <div class="rs-element__tool"></div>
      </div>
    </>
  );
};
export function useRender() {
  return {
    useRenderlayout,
    rcThree,
  };
}
