import { getAuth, onAuthStateChanged } from "firebase/auth";

export default class CurrentUserData {
  constructor() {
    this.uid = null;
    this.initialize();
  }

  initialize() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
      } else {
        this.uid = null;
      }
    });
  }

  getCurrentUid() {
    return this.uid;
  }
}

