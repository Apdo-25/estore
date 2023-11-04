import {
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
    useColorModeValue as mode,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

type OrderSummaryItemProps = {
    label: string
    value?: string
    children?: React.ReactNode
}



const OrderSummaryItem = (props: OrderSummaryItemProps) => {
    const { label, value, children } = props
    return (
        <Flex justify="space-between" fontSize="sm">
            <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
                {label}
            </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
        </Flex>
    )
}

type CartItemType = {
    product: {
        id: string
        name: string
        description: string
        price: number
        imageUrl: string
    }
    quantity: number
}

export const CartOrderSummary = () => {
    const { cart } = useCart()
    const [coupon, setCoupon] = useState('')


    const totalPrice = cart?.reduce((total, item) => {
        if (item && item.product && typeof item.product.price === 'number') {
            return total + item.product.price * item.quantity;
        }
        return total; // if the item or product is not valid, just return the accumulated total so far
    }, 0) || 0;

    return (
        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Order Summary</Heading>

            <Stack spacing="6">
                <OrderSummaryItem label="Subtotal" value={formatPrice(totalPrice)} />
                <OrderSummaryItem label="Shipping + Tax">
                    <Link href="#" textDecor="underline">
                        Calculate shipping
                    </Link>
                </OrderSummaryItem>
                <OrderSummaryItem label="Coupon Code">
                    <InputGroup size="md">
                        <Input 
                            pr="4.5rem"
                            type="text"
                            placeholder="Enter code"
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                            aria-label="Coupon Code"
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => {/* Handle coupon application */}}>
                                Apply
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </OrderSummaryItem>
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        {formatPrice(totalPrice)}
                    </Text>
                </Flex>
            </Stack>
            <Button colorScheme="blue" size="lg" fontSize="md" rightIcon={<FaArrowRight />}>
                Checkout
            </Button>
        </Stack>
    )
}