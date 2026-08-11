import math
import struct
import wave
import random
import os

os.makedirs('assets/sounds', exist_ok=True)

def write_wav(filename, samples, sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for sample in samples:
            wav_file.writeframes(struct.pack('<h', int(max(-32768, min(32767, sample * 32767)))))

def generate_whoosh():
    sr = 44100
    duration = 0.12
    samples = []
    for i in range(int(sr * duration)):
        t = i / sr
        # Ultra smooth: pure sine wave, low pitch (100Hz -> 200Hz), zero noise, lower volume
        freq = 100 + 100 * (t / duration)
        env = (math.sin(math.pi * (t / duration))) ** 2
        val = math.sin(2 * math.pi * freq * t) * env
        samples.append(val * 0.4)
    write_wav('assets/sounds/whoosh.wav', samples)

def generate_takk():
    sr = 44100
    duration = 0.12 # Make it longer (120ms) so it's clearly heard
    samples = []
    for i in range(int(sr * duration)):
        t = i / sr
        # Lower starting frequency for a thicker "takk" thud
        freq = 800 * math.exp(-t * 100)
        env = math.exp(-t * 40)
        val = math.sin(2 * math.pi * freq * t) * env
        samples.append(val * 0.9) # Higher volume
    write_wav('assets/sounds/takk.wav', samples)

def generate_clear():
    sr = 44100
    duration = 0.5
    samples = []
    for i in range(int(sr * duration)):
        t = i / sr
        # Nice bell-like chime (synth)
        f1 = 523.25 # C5
        f2 = 659.25 # E5
        f3 = 783.99 # G5
        env = math.exp(-t * 6)
        val = (math.sin(2*math.pi*f1*t) + math.sin(2*math.pi*f2*t) + math.sin(2*math.pi*f3*t))/3
        samples.append(val * env * 0.6)
    write_wav('assets/sounds/clear.wav', samples)

generate_whoosh()
generate_takk()
generate_clear()
print("Sounds generated!")
