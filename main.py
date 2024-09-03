def check_prime(n):
    for i in range(2,n//2):
        if n%i == 0:
            return True
    return False


def to_number(arr):
    n=0
    for i in range(len(arr)):
        n=n*10+arr[i]
    return n


def left_shieft(n):
    arr=[]
    while n!=0:
        arr.append(n%10)
        n=n//10

    if check_prime(to_number(arr)):
        return False

    for i in range(len(arr)-1):
        arr[i],arr[i+1]=arr[i+1],arr[i]
        if check_prime(to_number(arr)):
            return False
    return True


n=int(input("Enter a number: "))

if left_shieft(n):
    print("Circular prime")
else:
    print("not Circular prime")