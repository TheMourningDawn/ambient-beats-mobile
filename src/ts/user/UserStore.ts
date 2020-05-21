import AsyncStorage from '@react-native-community/async-storage';
import { UserModel } from './UserModel';

export class UserStore {

    async getUser(): Promise<UserModel> {
        console.info("Getting user")
        return await AsyncStorage.getItem(`@user`)
        .then((json) => {
            if ( !!json ) {
                const userModel: any = JSON.parse(json) as UserModel
                return userModel;
            }
        });
    }

    async setUser(user: UserModel): Promise<void> {
        console.log("Setting user")
        var item = await AsyncStorage.setItem(`@user`, JSON.stringify(user));
        
        return item
    }


    async deleteUser(): Promise<void> {
        return await AsyncStorage.removeItem(`@user`);
    }
};

const userStore = new UserStore();
export default userStore;