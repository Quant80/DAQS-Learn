import sys

name = sys.argv[1] if len(sys.argv) > 1 else "DAQS learner"
print(f"Hello from inside a container, {name}!")
