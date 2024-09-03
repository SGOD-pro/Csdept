num=int(input("Enter the number:- "))
n=int(input("Enter Times:- "))

bin_len=len(bin(11))-2
if n>bin_len:
    print("not possible")
    exit(0)

num=num>>n
if num&(num-1)==0 and num:
    print("number is:- ",num)
    exit(0)

print("not possible")