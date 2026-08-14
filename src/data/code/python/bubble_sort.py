def bubble_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
        swapped = True
    if not swapped:
      break
  return arr

if __name__ == "__main__":
  test_list1 = [64, 34, 25, 12, 22, 11, 90]
  print(f"Before sort: {test_list1}")
  bubble_sort(test_list1)
  print(f"After sort: {test_list1}")

  test_list2 = [1, 2, 3, 4, 5]
  print(f"\nBefore sort: {test_list2}")
  bubble_sort(test_list2)
  print(f"After sort: {test_list2}")

  test_list3 = [5, 2, 8, 2, 9, 1, 5]
  print(f"\nBefore sort: {test_list3}")
  bubble_sort(test_list3)
  print(f"After sort: {test_list3}")

def bubble_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
        swapped = True
    if not swapped:
      break
  return arr

if __name__ == "__main__":
  test_list1 = [64, 34, 25, 12, 22, 11, 90]
  print(f"Before sort: {test_list1}")
  bubble_sort(test_list1)
  print(f"After sort: {test_list1}")

  test_list2 = [1, 2, 3, 4, 5]
  print(f"\nBefore sort: {test_list2}")
  bubble_sort(test_list2)
  print(f"After sort: {test_list2}")

  test_list3 = [5, 2, 8, 2, 9, 1, 5]
  print(f"\nBefore sort: {test_list3}")
  bubble_sort(test_list3)
  print(f"After sort: {test_list3}")
