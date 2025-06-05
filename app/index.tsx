import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

interface Leader {
    name: string
    score: number
}

export default function app() {
    const leaderBoard = useAsyncStorage<Leader[]>('leaderBoard', [])

    const router = useRouter();
    const redirect = () => {
        router.push('/10/1')
    }
    return (
        <Text>
            hello
            {leaderBoard.data?.map((e) => {
                return (
                    <View key={e.name}>
                        <Text>{e.name}</Text>
                        <Text>{e.score}</Text>
                    </View>
                )
            })}
            <Button title="asd" onPress={redirect}></Button>
        </Text>
    );
}