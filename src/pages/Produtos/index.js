import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme';

import { products } from '../../mocks/products';

import Card from '../../components/Card';

export default function Produtos({
    navigation
}) {

    const insets = useSafeAreaInsets();

    const handleProductPress = () => {
      navigation.navigate('Produto Cadastrado');
    };

    const HeroSection = () => (
        <View style={styles.hero}>
            <Text style={styles.title}>
                Produtos
            </Text>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom
                }
            ]}
        >
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={products}
                renderItem={({ item }) => (
                    <Card
                        title={item.name}
                        price={item.price}
                        image={item.imageUrl}
                        onPress={() => handleProductPress(item.id)}
                        showFooter={true}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={HeroSection}
                contentContainerStyle={styles.content}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1
    },

    hero: {
        marginTop: theme.spacing[4],
        marginBottom: theme.spacing[8]
    },

    content: {
        paddingHorizontal: theme.spacing[3],
        paddingBottom: theme.spacing[6]
    },

    grid: {
        flex: 1,
        justifyContent: 'space-between',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[5]
    },

    title: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing[2]
    },

    subtitle: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.light
    },
});