
import sys
import traceback

print("Attempting to import pinecone...")
try:
    import pinecone
    print(f"SUCCESS. Pinecone location: {pinecone.__file__}")
    print(f"Pinecone version: {getattr(pinecone, '__version__', 'unknown')}")
except Exception:
    print("FAILURE.")
    traceback.print_exc()

print("\nChecking pkg_resources...")
try:
    import pkg_resources
    try:
        dist = pkg_resources.get_distribution("pinecone-client")
        print(f"pinecone-client version: {dist.version}")
    except pkg_resources.DistributionNotFound:
        print("pinecone-client not found in pkg_resources")
except ImportError:
    print("pkg_resources not installed")
