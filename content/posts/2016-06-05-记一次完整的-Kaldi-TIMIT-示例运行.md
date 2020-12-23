---
date: "2016-06-05 11:56:48"
toc: true
id: 200
slug: /posts/kaldi-timit-example2
aliases:
    - /archives/2016/06/200/
tags:
    - 语音识别
    - Kaldi
title: 记一次完整的 Kaldi-TIMIT 示例运行
---

整个例子从 `Sat Jun 4 22:45:55 CST 2016` 开始，于 `Sun Jun 5 11:16:53 CST 2016` 结束，共经历约 12 个小时。

在 TIMIT 的代码中，一共分为了以下几个示例：

1. 数据预处理；
2. MFCC 特征提取 & 训练集和测试集的 CMVN，这里只提取了 MFCC，Kaldi 里支持 MFCC，PLP，PITCH；
3. 单音树训练和解码，是语音识别最基础的部分
4. 三音素的训练和解码（Deltas + Delta-Deltas）
5. 三音素模型基础上做了LDA + MLLT变换的训练和解码
6. 三音素模型基础上做了LDA + MLLT +SAT变换的训练和解码
7. 三音素模型基础上做了SGMM2的训练和解码，SGMM2是povey 提出的
8. 三音素模型基础上做了 MMI + SGMM2 的训练和解码
9. DNN 混合训练和解码（povey 版本模型，看网上说不建议使用？）
10. 系统融合(DNN+SGMM)
11. Karel DNN 通用深度学习模型的训练和解码
12. 获取结果

<!--more-->

总的来说，计算机的资源没有完全被利用起来，整个过程中第十步是耗时是最长的，共花费约七个小时左右，主要时间消耗在下面代码的第三行中：

```
utils/subset_data_dir_tr_cv.sh data-fmllr-tri3/train data-fmllr-tri3/train_tr90 data-fmllr-tri3/train_cv10
/Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/utils/subset_data_dir.sh: reducing #utt from     3696 to     3320
/Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/utils/subset_data_dir.sh: reducing #utt from     3696 to      376
```

这部分主要使用显卡进行计算，显卡是目前这台`MacBook Pro`的最重要的瓶颈。

整个过程中 CPU 的使用情况记录如下图所示：

![JOB](/images/posts/200/1.png)

GPU 的使用情况如下图所示：

![JOB](/images/posts/200/2.png)

GPU 的显存消耗情况如下图所示：

![JOB](/images/posts/200/3.png)

处理器平均负载如下图所示：

![JOB](/images/posts/200/4.png)

下面是整个过程的输出日志：

```
Last login: Sat Jun  4 22:37:50 on ttys001
➜  kaldi/egs/timit/s5 master ✗ ./run.sh
============================================================================
TIMIT Start at  Sat Jun 4 22:45:55 CST 2016
============================================================================
============================================================================
                Data & Lexicon & Language Preparation                     
============================================================================
wav-to-duration scp:train_wav.scp ark,t:train_dur.ark 
WARNING (wav-to-duration:Close():kaldi-io.cc:500) Pipe /Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/../../../tools/sph2pipe_v2.5/sph2pipe -f wav /Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/data/TIMIT-old/TRAIN/DR2/FAEM0/si1392.wav | had nonzero return status 13
…………[中间都是警告 故省略]
WARNING (wav-to-duration:Close():kaldi-io.cc:500) Pipe /Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/../../../tools/sph2pipe_v2.5/sph2pipe -f wav /Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/data/TIMIT-old/TEST/DR3/MTHC0/sx295.wav | had nonzero return status 13
LOG (wav-to-duration:main():wav-to-duration.cc:90) Printed duration for 192 audio files.
LOG (wav-to-duration:main():wav-to-duration.cc:92) Mean duration was 3.03646, min and max durations were 1.30562, 6.21444
Data preparation succeeded
Temporary directory stat_26716 does not exist
creating stat_26716
Extracting dictionary from training corpus
Splitting dictionary into 3 lists
Extracting n-gram statistics for each word list
Important: dictionary must be ordered according to order of appearance of words in data
used to generate n-gram blocks,  so that sub language model blocks results ordered too
dict.000
dict.001
dict.002
$bin/ngt -i="$inpfile" -n=$order -gooout=y -o="$gzip -c > $tmpdir/ngram.${sdict}.gz" -fd="$tmpdir/$sdict" $dictionary -iknstat="$tmpdir/ikn.stat.$sdict" >> $logfile 2>&1
Estimating language models for each word list
dict.000
dict.001
dict.002
$scr/build-sublm.pl $verbose $prune $smoothing --size $order --ngrams "$gunzip -c $tmpdir/ngram.${sdict}.gz" -sublm $tmpdir/lm.$sdict >> $logfile 2>&1
Merging language models into data/local/lm_tmp/lm_phone_bg.ilm.gz
Cleaning temporary directory stat_26716
Removing temporary directory stat_26716
inpfile: data/local/lm_tmp/lm_phone_bg.ilm.gz
outfile: /dev/stdout
loading up to the LM level 1000 (if any)
dub: 10000000
Language Model Type of data/local/lm_tmp/lm_phone_bg.ilm.gz is 1
Language Model Type is 1
iARPA
loadtxt_ram()
1-grams: reading 51 entries
done level 1
2-grams: reading 1694 entries
done level 2
done
OOV code is 50
OOV code is 50
OOV code is 50
Saving in txt format to /dev/stdout
savetxt: /dev/stdout
save: 51 1-grams
save: 1694 2-grams
done
Dictionary & language model preparation succeeded
Checking data/local/dict/silence_phones.txt ...
--> reading data/local/dict/silence_phones.txt
--> data/local/dict/silence_phones.txt is OK

Checking data/local/dict/optional_silence.txt ...
--> reading data/local/dict/optional_silence.txt
--> data/local/dict/optional_silence.txt is OK

Checking data/local/dict/nonsilence_phones.txt ...
--> reading data/local/dict/nonsilence_phones.txt
--> data/local/dict/nonsilence_phones.txt is OK

Checking disjoint: silence_phones.txt, nonsilence_phones.txt
--> disjoint property is OK.

Checking data/local/dict/lexicon.txt
--> reading data/local/dict/lexicon.txt
--> data/local/dict/lexicon.txt is OK

Checking data/local/dict/lexiconp.txt
--> reading data/local/dict/lexiconp.txt
--> data/local/dict/lexiconp.txt is OK

Checking lexicon pair data/local/dict/lexicon.txt and data/local/dict/lexiconp.txt
--> lexicon pair data/local/dict/lexicon.txt and data/local/dict/lexiconp.txt match

Checking data/local/dict/extra_questions.txt ...
--> reading data/local/dict/extra_questions.txt
--> data/local/dict/extra_questions.txt is OK
--> SUCCESS [validating dictionary directory data/local/dict]

fstaddselfloops data/lang/phones/wdisambig_phones.int data/lang/phones/wdisambig_words.int 
prepare_lang.sh: validating output directory
utils/validate_lang.pl data/lang
Checking data/lang/phones.txt ...
--> data/lang/phones.txt is OK

Checking words.txt: #0 ...
--> data/lang/words.txt is OK

Checking disjoint: silence.txt, nonsilence.txt, disambig.txt ...
--> silence.txt and nonsilence.txt are disjoint
--> silence.txt and disambig.txt are disjoint
--> disambig.txt and nonsilence.txt are disjoint
--> disjoint property is OK

Checking sumation: silence.txt, nonsilence.txt, disambig.txt ...
--> summation property is OK

Checking data/lang/phones/context_indep.{txt, int, csl} ...
--> 1 entry/entries in data/lang/phones/context_indep.txt
--> data/lang/phones/context_indep.int corresponds to data/lang/phones/context_indep.txt
--> data/lang/phones/context_indep.csl corresponds to data/lang/phones/context_indep.txt
--> data/lang/phones/context_indep.{txt, int, csl} are OK

Checking data/lang/phones/nonsilence.{txt, int, csl} ...
--> 47 entry/entries in data/lang/phones/nonsilence.txt
--> data/lang/phones/nonsilence.int corresponds to data/lang/phones/nonsilence.txt
--> data/lang/phones/nonsilence.csl corresponds to data/lang/phones/nonsilence.txt
--> data/lang/phones/nonsilence.{txt, int, csl} are OK

Checking data/lang/phones/silence.{txt, int, csl} ...
--> 1 entry/entries in data/lang/phones/silence.txt
--> data/lang/phones/silence.int corresponds to data/lang/phones/silence.txt
--> data/lang/phones/silence.csl corresponds to data/lang/phones/silence.txt
--> data/lang/phones/silence.{txt, int, csl} are OK

Checking data/lang/phones/optional_silence.{txt, int, csl} ...
--> 1 entry/entries in data/lang/phones/optional_silence.txt
--> data/lang/phones/optional_silence.int corresponds to data/lang/phones/optional_silence.txt
--> data/lang/phones/optional_silence.csl corresponds to data/lang/phones/optional_silence.txt
--> data/lang/phones/optional_silence.{txt, int, csl} are OK

Checking data/lang/phones/disambig.{txt, int, csl} ...
--> 2 entry/entries in data/lang/phones/disambig.txt
--> data/lang/phones/disambig.int corresponds to data/lang/phones/disambig.txt
--> data/lang/phones/disambig.csl corresponds to data/lang/phones/disambig.txt
--> data/lang/phones/disambig.{txt, int, csl} are OK

Checking data/lang/phones/roots.{txt, int} ...
--> 48 entry/entries in data/lang/phones/roots.txt
--> data/lang/phones/roots.int corresponds to data/lang/phones/roots.txt
--> data/lang/phones/roots.{txt, int} are OK

Checking data/lang/phones/sets.{txt, int} ...
--> 48 entry/entries in data/lang/phones/sets.txt
--> data/lang/phones/sets.int corresponds to data/lang/phones/sets.txt
--> data/lang/phones/sets.{txt, int} are OK

Checking data/lang/phones/extra_questions.{txt, int} ...
--> 2 entry/entries in data/lang/phones/extra_questions.txt
--> data/lang/phones/extra_questions.int corresponds to data/lang/phones/extra_questions.txt
--> data/lang/phones/extra_questions.{txt, int} are OK

Checking optional_silence.txt ...
--> reading data/lang/phones/optional_silence.txt
--> data/lang/phones/optional_silence.txt is OK

Checking disambiguation symbols: #0 and #1
--> data/lang/phones/disambig.txt has "#0" and "#1"
--> data/lang/phones/disambig.txt is OK

Checking topo ...

Checking word-level disambiguation symbols...
--> data/lang/phones/wdisambig.txt exists (newer prepare_lang.sh)
Checking data/lang/oov.{txt, int} ...
--> 1 entry/entries in data/lang/oov.txt
--> data/lang/oov.int corresponds to data/lang/oov.txt
--> data/lang/oov.{txt, int} are OK

--> data/lang/L.fst is olabel sorted
--> data/lang/L_disambig.fst is olabel sorted
--> SUCCESS [validating lang directory data/lang]
Preparing train, dev and test data
utils/validate_data_dir.sh: Successfully validated data-directory data/train
utils/validate_data_dir.sh: Successfully validated data-directory data/dev
utils/validate_data_dir.sh: Successfully validated data-directory data/test
Preparing language models for test
arpa2fst --disambig-symbol=#0 --read-symbol-table=data/lang_test_bg/words.txt - data/lang_test_bg/G.fst 
LOG (arpa2fst:Read():arpa-file-parser.cc:90) Reading \data\ section.
LOG (arpa2fst:Read():arpa-file-parser.cc:145) Reading \1-grams: section.
LOG (arpa2fst:Read():arpa-file-parser.cc:145) Reading \2-grams: section.
fstisstochastic data/lang_test_bg/G.fst 
0.000367058 -0.0763018
utils/validate_lang.pl data/lang_test_bg
Checking data/lang_test_bg/phones.txt ...
--> data/lang_test_bg/phones.txt is OK

Checking words.txt: #0 ...
--> data/lang_test_bg/words.txt is OK

Checking disjoint: silence.txt, nonsilence.txt, disambig.txt ...
--> silence.txt and nonsilence.txt are disjoint
--> silence.txt and disambig.txt are disjoint
--> disambig.txt and nonsilence.txt are disjoint
--> disjoint property is OK

Checking sumation: silence.txt, nonsilence.txt, disambig.txt ...
--> summation property is OK

Checking data/lang_test_bg/phones/context_indep.{txt, int, csl} ...
--> 1 entry/entries in data/lang_test_bg/phones/context_indep.txt
--> data/lang_test_bg/phones/context_indep.int corresponds to data/lang_test_bg/phones/context_indep.txt
--> data/lang_test_bg/phones/context_indep.csl corresponds to data/lang_test_bg/phones/context_indep.txt
--> data/lang_test_bg/phones/context_indep.{txt, int, csl} are OK

Checking data/lang_test_bg/phones/nonsilence.{txt, int, csl} ...
--> 47 entry/entries in data/lang_test_bg/phones/nonsilence.txt
--> data/lang_test_bg/phones/nonsilence.int corresponds to data/lang_test_bg/phones/nonsilence.txt
--> data/lang_test_bg/phones/nonsilence.csl corresponds to data/lang_test_bg/phones/nonsilence.txt
--> data/lang_test_bg/phones/nonsilence.{txt, int, csl} are OK

Checking data/lang_test_bg/phones/silence.{txt, int, csl} ...
--> 1 entry/entries in data/lang_test_bg/phones/silence.txt
--> data/lang_test_bg/phones/silence.int corresponds to data/lang_test_bg/phones/silence.txt
--> data/lang_test_bg/phones/silence.csl corresponds to data/lang_test_bg/phones/silence.txt
--> data/lang_test_bg/phones/silence.{txt, int, csl} are OK

Checking data/lang_test_bg/phones/optional_silence.{txt, int, csl} ...
--> 1 entry/entries in data/lang_test_bg/phones/optional_silence.txt
--> data/lang_test_bg/phones/optional_silence.int corresponds to data/lang_test_bg/phones/optional_silence.txt
--> data/lang_test_bg/phones/optional_silence.csl corresponds to data/lang_test_bg/phones/optional_silence.txt
--> data/lang_test_bg/phones/optional_silence.{txt, int, csl} are OK

Checking data/lang_test_bg/phones/disambig.{txt, int, csl} ...
--> 2 entry/entries in data/lang_test_bg/phones/disambig.txt
--> data/lang_test_bg/phones/disambig.int corresponds to data/lang_test_bg/phones/disambig.txt
--> data/lang_test_bg/phones/disambig.csl corresponds to data/lang_test_bg/phones/disambig.txt
--> data/lang_test_bg/phones/disambig.{txt, int, csl} are OK

Checking data/lang_test_bg/phones/roots.{txt, int} ...
--> 48 entry/entries in data/lang_test_bg/phones/roots.txt
--> data/lang_test_bg/phones/roots.int corresponds to data/lang_test_bg/phones/roots.txt
--> data/lang_test_bg/phones/roots.{txt, int} are OK

Checking data/lang_test_bg/phones/sets.{txt, int} ...
--> 48 entry/entries in data/lang_test_bg/phones/sets.txt
--> data/lang_test_bg/phones/sets.int corresponds to data/lang_test_bg/phones/sets.txt
--> data/lang_test_bg/phones/sets.{txt, int} are OK

Checking data/lang_test_bg/phones/extra_questions.{txt, int} ...
--> 2 entry/entries in data/lang_test_bg/phones/extra_questions.txt
--> data/lang_test_bg/phones/extra_questions.int corresponds to data/lang_test_bg/phones/extra_questions.txt
--> data/lang_test_bg/phones/extra_questions.{txt, int} are OK

Checking optional_silence.txt ...
--> reading data/lang_test_bg/phones/optional_silence.txt
--> data/lang_test_bg/phones/optional_silence.txt is OK

Checking disambiguation symbols: #0 and #1
--> data/lang_test_bg/phones/disambig.txt has "#0" and "#1"
--> data/lang_test_bg/phones/disambig.txt is OK

Checking topo ...

Checking word-level disambiguation symbols...
--> data/lang_test_bg/phones/wdisambig.txt exists (newer prepare_lang.sh)
Checking data/lang_test_bg/oov.{txt, int} ...
--> 1 entry/entries in data/lang_test_bg/oov.txt
--> data/lang_test_bg/oov.int corresponds to data/lang_test_bg/oov.txt
--> data/lang_test_bg/oov.{txt, int} are OK

--> data/lang_test_bg/L.fst is olabel sorted
--> data/lang_test_bg/L_disambig.fst is olabel sorted
--> data/lang_test_bg/G.fst is ilabel sorted
--> data/lang_test_bg/G.fst has 50 states
fstdeterminizestar data/lang_test_bg/G.fst /dev/null 
--> data/lang_test_bg/G.fst is determinizable
--> utils/lang/check_g_properties.pl successfully validated data/lang_test_bg/G.fst
--> utils/lang/check_g_properties.pl succeeded.
--> Testing determinizability of L_disambig . G
fstdeterminizestar 
fsttablecompose data/lang_test_bg/L_disambig.fst data/lang_test_bg/G.fst 
--> L_disambig . G is determinizable
--> SUCCESS [validating lang directory data/lang_test_bg]
Succeeded in formatting data.
============================================================================
         MFCC Feature Extration & CMVN for Training and Test set          
============================================================================
steps/make_mfcc.sh --cmd run.pl --nj 10 data/train exp/make_mfcc/train mfcc
steps/make_mfcc.sh: moving data/train/feats.scp to data/train/.backup
utils/validate_data_dir.sh: Successfully validated data-directory data/train
steps/make_mfcc.sh: [info]: no segments file exists: assuming wav.scp indexed by utterance.
Succeeded creating MFCC features for train
steps/compute_cmvn_stats.sh data/train exp/make_mfcc/train mfcc
Succeeded creating CMVN stats for train
steps/make_mfcc.sh --cmd run.pl --nj 10 data/dev exp/make_mfcc/dev mfcc
steps/make_mfcc.sh: moving data/dev/feats.scp to data/dev/.backup
utils/validate_data_dir.sh: Successfully validated data-directory data/dev
steps/make_mfcc.sh: [info]: no segments file exists: assuming wav.scp indexed by utterance.
Succeeded creating MFCC features for dev
steps/compute_cmvn_stats.sh data/dev exp/make_mfcc/dev mfcc
Succeeded creating CMVN stats for dev
steps/make_mfcc.sh --cmd run.pl --nj 10 data/test exp/make_mfcc/test mfcc
steps/make_mfcc.sh: moving data/test/feats.scp to data/test/.backup
utils/validate_data_dir.sh: Successfully validated data-directory data/test
steps/make_mfcc.sh: [info]: no segments file exists: assuming wav.scp indexed by utterance.
Succeeded creating MFCC features for test
steps/compute_cmvn_stats.sh data/test exp/make_mfcc/test mfcc
Succeeded creating CMVN stats for test
============================================================================
                     MonoPhone Training & Decoding                        
============================================================================
steps/train_mono.sh --nj 30 --cmd run.pl data/train data/lang exp/mono
steps/train_mono.sh: Initializing monophone system.
steps/train_mono.sh: Compiling training graphs
steps/train_mono.sh: Aligning data equally (pass 0)
steps/train_mono.sh: Pass 1
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 2
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 3
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 4
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 5
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 6
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 7
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 8
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 9
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 10
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 11
steps/train_mono.sh: Pass 12
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 13
steps/train_mono.sh: Pass 14
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 15
steps/train_mono.sh: Pass 16
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 17
steps/train_mono.sh: Pass 18
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 19
steps/train_mono.sh: Pass 20
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 21
steps/train_mono.sh: Pass 22
steps/train_mono.sh: Pass 23
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 24
steps/train_mono.sh: Pass 25
steps/train_mono.sh: Pass 26
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 27
steps/train_mono.sh: Pass 28
steps/train_mono.sh: Pass 29
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 30
steps/train_mono.sh: Pass 31
steps/train_mono.sh: Pass 32
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 33
steps/train_mono.sh: Pass 34
steps/train_mono.sh: Pass 35
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 36
steps/train_mono.sh: Pass 37
steps/train_mono.sh: Pass 38
steps/train_mono.sh: Aligning data
steps/train_mono.sh: Pass 39
2 warnings in exp/mono/log/align.*.*.log
Done
tree-info exp/mono/tree 
tree-info exp/mono/tree 
fstdeterminizestar --use-log=true 
fsttablecompose data/lang_test_bg/L_disambig.fst data/lang_test_bg/G.fst 
fstpushspecial 
fstminimizeencoded 
fstisstochastic data/lang_test_bg/tmp/LG.fst 
-0.0084541 -0.00929638
fstcomposecontext --context-size=1 --central-position=0 --read-disambig-syms=data/lang_test_bg/phones/disambig.int --write-disambig-syms=data/lang_test_bg/tmp/disambig_ilabels_1_0.int data/lang_test_bg/tmp/ilabels_1_0 
fstisstochastic data/lang_test_bg/tmp/CLG_1_0.fst 
-0.0084541 -0.00929645
make-h-transducer --disambig-syms-out=exp/mono/graph/disambig_tid.int --transition-scale=1.0 data/lang_test_bg/tmp/ilabels_1_0 exp/mono/tree exp/mono/final.mdl 
fstdeterminizestar --use-log=true 
fsttablecompose exp/mono/graph/Ha.fst data/lang_test_bg/tmp/CLG_1_0.fst 
fstminimizeencoded 
fstrmsymbols exp/mono/graph/disambig_tid.int 
fstrmepslocal 
fstisstochastic exp/mono/graph/HCLGa.fst 
0.000381767 -0.00951818
add-self-loops --self-loop-scale=0.1 --reorder=true exp/mono/final.mdl 
steps/decode.sh --nj 5 --cmd run.pl exp/mono/graph data/dev exp/mono/decode_dev
decode.sh: feature type is delta
steps/decode.sh --nj 5 --cmd run.pl exp/mono/graph data/test exp/mono/decode_test
decode.sh: feature type is delta
============================================================================
           tri1 : Deltas + Delta-Deltas Training & Decoding               
============================================================================
steps/align_si.sh --boost-silence 1.25 --nj 30 --cmd run.pl data/train data/lang exp/mono exp/mono_ali
steps/align_si.sh: feature type is delta
steps/align_si.sh: aligning data in data/train using model from exp/mono, putting alignments in exp/mono_ali
steps/align_si.sh: done aligning data.
steps/train_deltas.sh --cmd run.pl 2500 15000 data/train data/lang exp/mono_ali exp/tri1
steps/train_deltas.sh: accumulating tree stats
steps/train_deltas.sh: getting questions for tree-building, via clustering
steps/train_deltas.sh: building the tree
steps/train_deltas.sh: converting alignments from exp/mono_ali to use current tree
steps/train_deltas.sh: compiling graphs of transcripts
steps/train_deltas.sh: training pass 1
steps/train_deltas.sh: training pass 2
steps/train_deltas.sh: training pass 3
steps/train_deltas.sh: training pass 4
steps/train_deltas.sh: training pass 5
steps/train_deltas.sh: training pass 6
steps/train_deltas.sh: training pass 7
steps/train_deltas.sh: training pass 8
steps/train_deltas.sh: training pass 9
steps/train_deltas.sh: training pass 10
steps/train_deltas.sh: aligning data
steps/train_deltas.sh: training pass 11
steps/train_deltas.sh: training pass 12
steps/train_deltas.sh: training pass 13
steps/train_deltas.sh: training pass 14
steps/train_deltas.sh: training pass 15
steps/train_deltas.sh: training pass 16
steps/train_deltas.sh: training pass 17
steps/train_deltas.sh: training pass 18
steps/train_deltas.sh: training pass 19
steps/train_deltas.sh: training pass 20
steps/train_deltas.sh: aligning data
steps/train_deltas.sh: training pass 21
steps/train_deltas.sh: training pass 22
steps/train_deltas.sh: training pass 23
steps/train_deltas.sh: training pass 24
steps/train_deltas.sh: training pass 25
steps/train_deltas.sh: training pass 26
steps/train_deltas.sh: training pass 27
steps/train_deltas.sh: training pass 28
steps/train_deltas.sh: training pass 29
steps/train_deltas.sh: training pass 30
steps/train_deltas.sh: aligning data
steps/train_deltas.sh: training pass 31
steps/train_deltas.sh: training pass 32
steps/train_deltas.sh: training pass 33
steps/train_deltas.sh: training pass 34
85 warnings in exp/tri1/log/update.*.log
81 warnings in exp/tri1/log/init_model.log
1 warnings in exp/tri1/log/compile_questions.log
steps/train_deltas.sh: Done training system with delta+delta-delta features in exp/tri1
tree-info exp/tri1/tree 
tree-info exp/tri1/tree 
fstcomposecontext --context-size=3 --central-position=1 --read-disambig-syms=data/lang_test_bg/phones/disambig.int --write-disambig-syms=data/lang_test_bg/tmp/disambig_ilabels_3_1.int data/lang_test_bg/tmp/ilabels_3_1 
fstisstochastic data/lang_test_bg/tmp/CLG_3_1.fst 
0 -0.00929618
make-h-transducer --disambig-syms-out=exp/tri1/graph/disambig_tid.int --transition-scale=1.0 data/lang_test_bg/tmp/ilabels_3_1 exp/tri1/tree exp/tri1/final.mdl 
fsttablecompose exp/tri1/graph/Ha.fst data/lang_test_bg/tmp/CLG_3_1.fst 
fstrmsymbols exp/tri1/graph/disambig_tid.int 
fstdeterminizestar --use-log=true 
fstrmepslocal 
fstminimizeencoded 
fstisstochastic exp/tri1/graph/HCLGa.fst 
0.000443735 -0.0171465
HCLGa is not stochastic
add-self-loops --self-loop-scale=0.1 --reorder=true exp/tri1/final.mdl 
steps/decode.sh --nj 5 --cmd run.pl exp/tri1/graph data/dev exp/tri1/decode_dev
decode.sh: feature type is delta
steps/decode.sh --nj 5 --cmd run.pl exp/tri1/graph data/test exp/tri1/decode_test
decode.sh: feature type is delta
============================================================================
                 tri2 : LDA + MLLT Training & Decoding                    
============================================================================
steps/align_si.sh --nj 30 --cmd run.pl data/train data/lang exp/tri1 exp/tri1_ali
steps/align_si.sh: feature type is delta
steps/align_si.sh: aligning data in data/train using model from exp/tri1, putting alignments in exp/tri1_ali
steps/align_si.sh: done aligning data.
steps/train_lda_mllt.sh --cmd run.pl --splice-opts --left-context=3 --right-context=3 2500 15000 data/train data/lang exp/tri1_ali exp/tri2
Accumulating LDA statistics.
Accumulating tree stats
Getting questions for tree clustering.
Building the tree
steps/train_lda_mllt.sh: Initializing the model
Converting alignments from exp/tri1_ali to use current tree
Compiling graphs of transcripts
Training pass 1
Training pass 2
Estimating MLLT
Training pass 3
Training pass 4
Estimating MLLT
Training pass 5
Training pass 6
Estimating MLLT
Training pass 7
Training pass 8
Training pass 9
Training pass 10
Aligning data
Training pass 11
Training pass 12
Estimating MLLT
Training pass 13
Training pass 14
Training pass 15
Training pass 16
Training pass 17
Training pass 18
Training pass 19
Training pass 20
Aligning data
Training pass 21
Training pass 22
Training pass 23
Training pass 24
Training pass 25
Training pass 26
Training pass 27
Training pass 28
Training pass 29
Training pass 30
Aligning data
Training pass 31
Training pass 32
Training pass 33
Training pass 34
250 warnings in exp/tri2/log/update.*.log
105 warnings in exp/tri2/log/init_model.log
1 warnings in exp/tri2/log/compile_questions.log
Done training system with LDA+MLLT features in exp/tri2
tree-info exp/tri2/tree 
tree-info exp/tri2/tree 
make-h-transducer --disambig-syms-out=exp/tri2/graph/disambig_tid.int --transition-scale=1.0 data/lang_test_bg/tmp/ilabels_3_1 exp/tri2/tree exp/tri2/final.mdl 
fstminimizeencoded 
fstrmepslocal 
fstdeterminizestar --use-log=true 
fsttablecompose exp/tri2/graph/Ha.fst data/lang_test_bg/tmp/CLG_3_1.fst 
fstrmsymbols exp/tri2/graph/disambig_tid.int 
fstisstochastic exp/tri2/graph/HCLGa.fst 
0.00046259 -0.0171465
HCLGa is not stochastic
add-self-loops --self-loop-scale=0.1 --reorder=true exp/tri2/final.mdl 
steps/decode.sh --nj 5 --cmd run.pl exp/tri2/graph data/dev exp/tri2/decode_dev
decode.sh: feature type is lda
steps/decode.sh --nj 5 --cmd run.pl exp/tri2/graph data/test exp/tri2/decode_test
decode.sh: feature type is lda
============================================================================
              tri3 : LDA + MLLT + SAT Training & Decoding                 
============================================================================
steps/align_si.sh --nj 30 --cmd run.pl --use-graphs true data/train data/lang exp/tri2 exp/tri2_ali
steps/align_si.sh: feature type is lda
steps/align_si.sh: aligning data in data/train using model from exp/tri2, putting alignments in exp/tri2_ali
steps/align_si.sh: done aligning data.
steps/train_sat.sh --cmd run.pl 2500 15000 data/train data/lang exp/tri2_ali exp/tri3
steps/train_sat.sh: feature type is lda
steps/train_sat.sh: obtaining initial fMLLR transforms since not present in exp/tri2_ali
steps/train_sat.sh: Accumulating tree stats
steps/train_sat.sh: Getting questions for tree clustering.
steps/train_sat.sh: Building the tree
steps/train_sat.sh: Initializing the model
steps/train_sat.sh: Converting alignments from exp/tri2_ali to use current tree
steps/train_sat.sh: Compiling graphs of transcripts
Pass 1
Pass 2
Estimating fMLLR transforms
Pass 3
Pass 4
Estimating fMLLR transforms
Pass 5
Pass 6
Estimating fMLLR transforms
Pass 7
Pass 8
Pass 9
Pass 10
Aligning data
Pass 11
Pass 12
Estimating fMLLR transforms
Pass 13
Pass 14
Pass 15
Pass 16
Pass 17
Pass 18
Pass 19
Pass 20
Aligning data
Pass 21
Pass 22
Pass 23
Pass 24
Pass 25
Pass 26
Pass 27
Pass 28
Pass 29
Pass 30
Aligning data
Pass 31
Pass 32
Pass 33
Pass 34
54 warnings in exp/tri3/log/init_model.log
1 warnings in exp/tri3/log/compile_questions.log
4 warnings in exp/tri3/log/update.*.log
steps/train_sat.sh: Likelihood evolution:
-50.1111 -49.2407 -49.0362 -48.828 -48.1678 -47.4899 -47.0224 -46.7228 -46.4847 -45.9498 -45.693 -45.3736 -45.1913 -45.0527 -44.9283 -44.8162 -44.7086 -44.6033 -44.5019 -44.3417 -44.2037 -44.1136 -44.0283 -43.9478 -43.8703 -43.7937 -43.7204 -43.6485 -43.5755 -43.4783 -43.4019 -43.3752 -43.3591 -43.3474 
Done
tree-info exp/tri3/tree 
tree-info exp/tri3/tree 
make-h-transducer --disambig-syms-out=exp/tri3/graph/disambig_tid.int --transition-scale=1.0 data/lang_test_bg/tmp/ilabels_3_1 exp/tri3/tree exp/tri3/final.mdl 
fsttablecompose exp/tri3/graph/Ha.fst data/lang_test_bg/tmp/CLG_3_1.fst 
fstdeterminizestar --use-log=true 
fstminimizeencoded 
fstrmsymbols exp/tri3/graph/disambig_tid.int 
fstrmepslocal 
fstisstochastic exp/tri3/graph/HCLGa.fst 
0.00045076 -0.0171463
HCLGa is not stochastic
add-self-loops --self-loop-scale=0.1 --reorder=true exp/tri3/final.mdl 
steps/decode_fmllr.sh --nj 5 --cmd run.pl exp/tri3/graph data/dev exp/tri3/decode_dev
steps/decode.sh --scoring-opts  --num-threads 1 --skip-scoring false --acwt 0.083333 --nj 5 --cmd run.pl --beam 10.0 --model exp/tri3/final.alimdl --max-active 2000 exp/tri3/graph data/dev exp/tri3/decode_dev.si
decode.sh: feature type is lda
steps/decode_fmllr.sh: feature type is lda
steps/decode_fmllr.sh: getting first-pass fMLLR transforms.
steps/decode_fmllr.sh: doing main lattice generation phase
steps/decode_fmllr.sh: estimating fMLLR transforms a second time.
steps/decode_fmllr.sh: doing a final pass of acoustic rescoring.
steps/decode_fmllr.sh --nj 5 --cmd run.pl exp/tri3/graph data/test exp/tri3/decode_test
steps/decode.sh --scoring-opts  --num-threads 1 --skip-scoring false --acwt 0.083333 --nj 5 --cmd run.pl --beam 10.0 --model exp/tri3/final.alimdl --max-active 2000 exp/tri3/graph data/test exp/tri3/decode_test.si
decode.sh: feature type is lda
steps/decode_fmllr.sh: feature type is lda
steps/decode_fmllr.sh: getting first-pass fMLLR transforms.
steps/decode_fmllr.sh: doing main lattice generation phase
steps/decode_fmllr.sh: estimating fMLLR transforms a second time.
steps/decode_fmllr.sh: doing a final pass of acoustic rescoring.
============================================================================
                        SGMM2 Training & Decoding                         
============================================================================
steps/align_fmllr.sh --nj 30 --cmd run.pl data/train data/lang exp/tri3 exp/tri3_ali
steps/align_fmllr.sh: feature type is lda
steps/align_fmllr.sh: compiling training graphs
steps/align_fmllr.sh: aligning data in data/train using exp/tri3/final.alimdl and speaker-independent features.
steps/align_fmllr.sh: computing fMLLR transforms
steps/align_fmllr.sh: doing final alignment.
steps/align_fmllr.sh: done aligning data.
steps/train_ubm.sh --cmd run.pl 400 data/train data/lang exp/tri3_ali exp/ubm4
steps/train_ubm.sh: feature type is lda
steps/train_ubm.sh: using transforms from exp/tri3_ali
steps/train_ubm.sh: clustering model exp/tri3_ali/final.mdl to get initial UBM
steps/train_ubm.sh: doing Gaussian selection
Pass 0
Pass 1
Pass 2
steps/train_sgmm2.sh --cmd run.pl 7000 9000 data/train data/lang exp/tri3_ali exp/ubm4/final.ubm exp/sgmm2_4
steps/train_sgmm2.sh: feature type is lda
steps/train_sgmm2.sh: using transforms from exp/tri3_ali
steps/train_sgmm2.sh: accumulating tree stats
steps/train_sgmm2.sh: Getting questions for tree clustering.
steps/train_sgmm2.sh: Building the tree
steps/train_sgmm2.sh: Initializing the model
steps/train_sgmm2.sh: doing Gaussian selection
steps/train_sgmm2.sh: compiling training graphs
steps/train_sgmm2.sh: converting alignments
steps/train_sgmm2.sh: training pass 0 ... 
steps/train_sgmm2.sh: training pass 1 ... 
steps/train_sgmm2.sh: training pass 2 ... 
steps/train_sgmm2.sh: training pass 3 ... 
steps/train_sgmm2.sh: training pass 4 ... 
steps/train_sgmm2.sh: training pass 5 ... 
steps/train_sgmm2.sh: re-aligning data
steps/train_sgmm2.sh: training pass 6 ... 
steps/train_sgmm2.sh: training pass 7 ... 
steps/train_sgmm2.sh: training pass 8 ... 
steps/train_sgmm2.sh: training pass 9 ... 
steps/train_sgmm2.sh: training pass 10 ... 
steps/train_sgmm2.sh: re-aligning data
steps/train_sgmm2.sh: training pass 11 ... 
steps/train_sgmm2.sh: training pass 12 ... 
steps/train_sgmm2.sh: training pass 13 ... 
steps/train_sgmm2.sh: training pass 14 ... 
steps/train_sgmm2.sh: training pass 15 ... 
steps/train_sgmm2.sh: re-aligning data
steps/train_sgmm2.sh: training pass 16 ... 
steps/train_sgmm2.sh: training pass 17 ... 
steps/train_sgmm2.sh: training pass 18 ... 
steps/train_sgmm2.sh: training pass 19 ... 
steps/train_sgmm2.sh: training pass 20 ... 
steps/train_sgmm2.sh: training pass 21 ... 
steps/train_sgmm2.sh: training pass 22 ... 
steps/train_sgmm2.sh: training pass 23 ... 
steps/train_sgmm2.sh: training pass 24 ... 
steps/train_sgmm2.sh: building alignment model (pass 25)
steps/train_sgmm2.sh: building alignment model (pass 26)
steps/train_sgmm2.sh: building alignment model (pass 27)
1880 warnings in exp/sgmm2_4/log/update.*.log
217 warnings in exp/sgmm2_4/log/update_ali.*.log
1 warnings in exp/sgmm2_4/log/compile_questions.log
Done
tree-info exp/sgmm2_4/tree 
tree-info exp/sgmm2_4/tree 
make-h-transducer --disambig-syms-out=exp/sgmm2_4/graph/disambig_tid.int --transition-scale=1.0 data/lang_test_bg/tmp/ilabels_3_1 exp/sgmm2_4/tree exp/sgmm2_4/final.mdl 
fstdeterminizestar --use-log=true 
fsttablecompose exp/sgmm2_4/graph/Ha.fst data/lang_test_bg/tmp/CLG_3_1.fst 
fstrmepslocal 
fstminimizeencoded 
fstrmsymbols exp/sgmm2_4/graph/disambig_tid.int 
fstisstochastic exp/sgmm2_4/graph/HCLGa.fst 
0.000485192 -0.0171458
HCLGa is not stochastic
add-self-loops --self-loop-scale=0.1 --reorder=true exp/sgmm2_4/final.mdl 
steps/decode_sgmm2.sh --nj 5 --cmd run.pl --transform-dir exp/tri3/decode_dev exp/sgmm2_4/graph data/dev exp/sgmm2_4/decode_dev
steps/decode_sgmm2.sh: feature type is lda
steps/decode_sgmm2.sh: using transforms from exp/tri3/decode_dev
steps/decode_sgmm2.sh --nj 5 --cmd run.pl --transform-dir exp/tri3/decode_test exp/sgmm2_4/graph data/test exp/sgmm2_4/decode_test
steps/decode_sgmm2.sh: feature type is lda
steps/decode_sgmm2.sh: using transforms from exp/tri3/decode_test
============================================================================
                    MMI + SGMM2 Training & Decoding                       
============================================================================
steps/align_sgmm2.sh --nj 30 --cmd run.pl --transform-dir exp/tri3_ali --use-graphs true --use-gselect true data/train data/lang exp/sgmm2_4 exp/sgmm2_4_ali
steps/align_sgmm2.sh: feature type is lda
steps/align_sgmm2.sh: using transforms from exp/tri3_ali
steps/align_sgmm2.sh: aligning data in data/train using model exp/sgmm2_4/final.alimdl
steps/align_sgmm2.sh: computing speaker vectors (1st pass)
steps/align_sgmm2.sh: computing speaker vectors (2nd pass)
steps/align_sgmm2.sh: doing final alignment.
steps/align_sgmm2.sh: done aligning data.
steps/make_denlats_sgmm2.sh --nj 30 --sub-split 30 --acwt 0.2 --lattice-beam 10.0 --beam 18.0 --cmd run.pl --transform-dir exp/tri3_ali data/train data/lang exp/sgmm2_4_ali exp/sgmm2_4_denlats
steps/make_denlats_sgmm2.sh: Making unigram grammar FST in exp/sgmm2_4_denlats/lang
steps/make_denlats_sgmm2.sh: Compiling decoding graph in exp/sgmm2_4_denlats/dengraph
tree-info exp/sgmm2_4_ali/tree 
tree-info exp/sgmm2_4_ali/tree 
fstpushspecial 
fstdeterminizestar --use-log=true 
fstminimizeencoded 
fsttablecompose exp/sgmm2_4_denlats/lang/L_disambig.fst exp/sgmm2_4_denlats/lang/G.fst 
fstisstochastic exp/sgmm2_4_denlats/lang/tmp/LG.fst 
1.2886e-05 1.2886e-05
fstcomposecontext --context-size=3 --central-position=1 --read-disambig-syms=exp/sgmm2_4_denlats/lang/phones/disambig.int --write-disambig-syms=exp/sgmm2_4_denlats/lang/tmp/disambig_ilabels_3_1.int exp/sgmm2_4_denlats/lang/tmp/ilabels_3_1 
fstisstochastic exp/sgmm2_4_denlats/lang/tmp/CLG_3_1.fst 
1.26958e-05 0
make-h-transducer --disambig-syms-out=exp/sgmm2_4_denlats/dengraph/disambig_tid.int --transition-scale=1.0 exp/sgmm2_4_denlats/lang/tmp/ilabels_3_1 exp/sgmm2_4_ali/tree exp/sgmm2_4_ali/final.mdl 
fstdeterminizestar --use-log=true 
fstrmepslocal 
fsttablecompose exp/sgmm2_4_denlats/dengraph/Ha.fst exp/sgmm2_4_denlats/lang/tmp/CLG_3_1.fst 
fstrmsymbols exp/sgmm2_4_denlats/dengraph/disambig_tid.int 
fstminimizeencoded 
fstisstochastic exp/sgmm2_4_denlats/dengraph/HCLGa.fst 
0.000481188 -0.000485808
add-self-loops --self-loop-scale=0.1 --reorder=true exp/sgmm2_4_ali/final.mdl 
steps/make_denlats_sgmm2.sh: feature type is lda
steps/make_denlats_sgmm2.sh: using fMLLR transforms from exp/tri3_ali
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 1
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 2
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 3
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 4
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 5
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 6
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 7
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 8
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 9
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 10
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 11
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 12
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 13
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 14
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 15
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 16
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 17
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 18
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 19
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 20
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 21
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 22
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 23
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 24
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 25
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 26
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 27
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 28
filter_scps.pl: warning: some input lines were output to multiple files
filter_scps.pl: warning: some input lines were output to multiple files
steps/make_denlats_sgmm2.sh: Merging archives for data subset 29
steps/make_denlats_sgmm2.sh: Merging archives for data subset 30
steps/make_denlats_sgmm2.sh: done generating denominator lattices with SGMMs.
steps/train_mmi_sgmm2.sh --acwt 0.2 --cmd run.pl --transform-dir exp/tri3_ali --boost 0.1 --drop-frames true data/train data/lang exp/sgmm2_4_ali exp/sgmm2_4_denlats exp/sgmm2_4_mmi_b0.1
steps/train_mmi_sgmm2.sh: feature type is lda
steps/train_mmi_sgmm2.sh: using transforms from exp/tri3_ali
steps/train_mmi_sgmm2.sh: using speaker vectors from exp/sgmm2_4_ali
steps/train_mmi_sgmm2.sh: using Gaussian-selection info from exp/sgmm2_4_ali
Iteration 0 of MMI training
Iteration 0: objf was 0.500726156431174, MMI auxf change was 0.0161713620720771
Iteration 1 of MMI training
Iteration 1: objf was 0.515630891203772, MMI auxf change was 0.00245126566579809
Iteration 2 of MMI training
Iteration 2: objf was 0.518355502911444, MMI auxf change was 0.000653581941336548
Iteration 3 of MMI training
Iteration 3: objf was 0.519283249728163, MMI auxf change was 0.000388201521483825
MMI training finished
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 1 --transform-dir exp/tri3/decode_dev data/lang_test_bg data/dev exp/sgmm2_4/decode_dev exp/sgmm2_4_mmi_b0.1/decode_dev_it1
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_dev
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_dev
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/1.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 1 --transform-dir exp/tri3/decode_test data/lang_test_bg data/test exp/sgmm2_4/decode_test exp/sgmm2_4_mmi_b0.1/decode_test_it1
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_test
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_test
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/1.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 2 --transform-dir exp/tri3/decode_dev data/lang_test_bg data/dev exp/sgmm2_4/decode_dev exp/sgmm2_4_mmi_b0.1/decode_dev_it2
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_dev
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_dev
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/2.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 2 --transform-dir exp/tri3/decode_test data/lang_test_bg data/test exp/sgmm2_4/decode_test exp/sgmm2_4_mmi_b0.1/decode_test_it2
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_test
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_test
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/2.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 3 --transform-dir exp/tri3/decode_dev data/lang_test_bg data/dev exp/sgmm2_4/decode_dev exp/sgmm2_4_mmi_b0.1/decode_dev_it3
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_dev
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_dev
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/3.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 3 --transform-dir exp/tri3/decode_test data/lang_test_bg data/test exp/sgmm2_4/decode_test exp/sgmm2_4_mmi_b0.1/decode_test_it3
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_test
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_test
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/3.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 4 --transform-dir exp/tri3/decode_dev data/lang_test_bg data/dev exp/sgmm2_4/decode_dev exp/sgmm2_4_mmi_b0.1/decode_dev_it4
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_dev
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_dev
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/4.mdl
steps/decode_sgmm2_rescore.sh --cmd run.pl --iter 4 --transform-dir exp/tri3/decode_test data/lang_test_bg data/test exp/sgmm2_4/decode_test exp/sgmm2_4_mmi_b0.1/decode_test_it4
steps/decode_sgmm2_rescore.sh: using speaker vectors from exp/sgmm2_4/decode_test
steps/decode_sgmm2_rescore.sh: feature type is lda
steps/decode_sgmm2_rescore.sh: using transforms from exp/tri3/decode_test
steps/decode_sgmm2_rescore.sh: rescoring lattices with SGMM model in exp/sgmm2_4_mmi_b0.1/4.mdl
============================================================================
                    DNN Hybrid Training & Decoding                        
============================================================================
steps/nnet2/train_tanh.sh --mix-up 5000 --initial-learning-rate 0.015 --final-learning-rate 0.002 --num-hidden-layers 2 --num-jobs-nnet 30 --cmd run.pl data/train data/lang exp/tri3_ali exp/tri4_nnet
steps/nnet2/train_tanh.sh: calling get_lda.sh
steps/nnet2/get_lda.sh --transform-dir exp/tri3_ali --splice-width 4 --cmd run.pl data/train data/lang exp/tri3_ali exp/tri4_nnet
steps/nnet2/get_lda.sh: feature type is lda
steps/nnet2/get_lda.sh: using transforms from exp/tri3_ali
feat-to-dim 'ark,s,cs:utils/subset_scp.pl --quiet 333 data/train/split30/1/feats.scp | apply-cmvn  --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- | splice-feats --left-context=3 --right-context=3 ark:- ark:- | transform-feats exp/tri4_nnet/final.mat ark:- ark:- | transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- |' - 
transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- 
apply-cmvn --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- 
transform-feats exp/tri4_nnet/final.mat ark:- ark:- 
splice-feats --left-context=3 --right-context=3 ark:- ark:- 
WARNING (feat-to-dim:Close():kaldi-io.cc:500) Pipe utils/subset_scp.pl --quiet 333 data/train/split30/1/feats.scp | apply-cmvn  --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- | splice-feats --left-context=3 --right-context=3 ark:- ark:- | transform-feats exp/tri4_nnet/final.mat ark:- ark:- | transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- | had nonzero return status 36096
feat-to-dim 'ark,s,cs:utils/subset_scp.pl --quiet 333 data/train/split30/1/feats.scp | apply-cmvn  --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- | splice-feats --left-context=3 --right-context=3 ark:- ark:- | transform-feats exp/tri4_nnet/final.mat ark:- ark:- | transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- | splice-feats --left-context=4 --right-context=4 ark:- ark:- |' - 
transform-feats exp/tri4_nnet/final.mat ark:- ark:- 
apply-cmvn --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- 
splice-feats --left-context=3 --right-context=3 ark:- ark:- 
transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- 
splice-feats --left-context=4 --right-context=4 ark:- ark:- 
WARNING (feat-to-dim:Close():kaldi-io.cc:500) Pipe utils/subset_scp.pl --quiet 333 data/train/split30/1/feats.scp | apply-cmvn  --utt2spk=ark:data/train/split30/1/utt2spk scp:data/train/split30/1/cmvn.scp scp:- ark:- | splice-feats --left-context=3 --right-context=3 ark:- ark:- | transform-feats exp/tri4_nnet/final.mat ark:- ark:- | transform-feats --utt2spk=ark:data/train/split30/1/utt2spk ark:exp/tri3_ali/trans.1 ark:- ark:- | splice-feats --left-context=4 --right-context=4 ark:- ark:- | had nonzero return status 36096
steps/nnet2/get_lda.sh: Accumulating LDA statistics.
steps/nnet2/get_lda.sh: Finished estimating LDA
steps/nnet2/train_tanh.sh: calling get_egs.sh
steps/nnet2/get_egs.sh --transform-dir exp/tri3_ali --splice-width 4 --samples-per-iter 200000 --num-jobs-nnet 30 --stage 0 --cmd run.pl --io-opts -tc 5 data/train data/lang exp/tri3_ali exp/tri4_nnet
steps/nnet2/get_egs.sh: feature type is lda
steps/nnet2/get_egs.sh: using transforms from exp/tri3_ali
steps/nnet2/get_egs.sh: working out number of frames of training data
utils/data/get_utt2dur.sh: segments file does not exist so getting durations from wave files
utils/data/get_utt2dur.sh: successfully obtained utterance lengths from sphere-file headers
utils/data/get_utt2dur.sh: computed data/train/utt2dur
feat-to-len scp:data/train/feats.scp ark,t:- 
steps/nnet2/get_egs.sh: Every epoch, splitting the data up into 1 iterations,
steps/nnet2/get_egs.sh: giving samples-per-iteration of 37740 (you requested 200000).
Getting validation and training subset examples.
steps/nnet2/get_egs.sh: extracting validation and training-subset alignments.
copy-int-vector ark:- ark,t:- 
LOG (copy-int-vector:main():copy-int-vector.cc:83) Copied 3696 vectors of int32.
Getting subsets of validation examples for diagnostics and combination.
Creating training examples
Generating training examples on disk
steps/nnet2/get_egs.sh: rearranging examples into parts for different parallel jobs
steps/nnet2/get_egs.sh: Since iters-per-epoch == 1, just concatenating the data.
Shuffling the order of training examples
(in order to avoid stressing the disk, these won't all run at once).
steps/nnet2/get_egs.sh: Finished preparing training examples
steps/nnet2/train_tanh.sh: initializing neural net
Training transition probabilities and setting priors
steps/nnet2/train_tanh.sh: Will train for 15 + 5 epochs, equalling 
steps/nnet2/train_tanh.sh: 15 + 5 = 20 iterations, 
steps/nnet2/train_tanh.sh: (while reducing learning rate) + (with constant learning rate).
Training neural net (pass 0)
Training neural net (pass 1)
Training neural net (pass 2)
Training neural net (pass 3)
Training neural net (pass 4)
Training neural net (pass 5)
Training neural net (pass 6)
Training neural net (pass 7)
Training neural net (pass 8)
Training neural net (pass 9)
Training neural net (pass 10)
Training neural net (pass 11)
Training neural net (pass 12)
Mixing up from 1956 to 5000 components
Training neural net (pass 13)
Training neural net (pass 14)
Training neural net (pass 15)
Training neural net (pass 16)
Training neural net (pass 17)
Training neural net (pass 18)
Training neural net (pass 19)
Setting num_iters_final=5
Getting average posterior for purposes of adjusting the priors.
Re-adjusting priors based on computed posteriors
Done
Cleaning up data
steps/nnet2/remove_egs.sh: Finished deleting examples in exp/tri4_nnet/egs
Removing most of the models
steps/nnet2/decode.sh --cmd run.pl --nj 5 --num-threads 6 --transform-dir exp/tri3/decode_dev exp/tri3/graph data/dev exp/tri4_nnet/decode_dev
steps/nnet2/decode.sh: feature type is lda
steps/nnet2/decode.sh: using transforms from exp/tri3/decode_dev
score best paths
score confidence and timing with sclite
Decoding done.
steps/nnet2/decode.sh --cmd run.pl --nj 5 --num-threads 6 --transform-dir exp/tri3/decode_test exp/tri3/graph data/test exp/tri4_nnet/decode_test
steps/nnet2/decode.sh: feature type is lda
steps/nnet2/decode.sh: using transforms from exp/tri3/decode_test
score best paths
score confidence and timing with sclite
Decoding done.
============================================================================
                    System Combination (DNN+SGMM)                         
============================================================================
============================================================================
               DNN Hybrid Training & Decoding (Karel's recipe)            
============================================================================
steps/nnet/make_fmllr_feats.sh --nj 10 --cmd run.pl --transform-dir exp/tri3/decode_test data-fmllr-tri3/test data/test exp/tri3 data-fmllr-tri3/test/log data-fmllr-tri3/test/data
steps/nnet/make_fmllr_feats.sh: feature type is lda_fmllr
utils/copy_data_dir.sh: copied data from data/test to data-fmllr-tri3/test
utils/validate_data_dir.sh: Successfully validated data-directory data-fmllr-tri3/test
steps/nnet/make_fmllr_feats.sh: Done!, type lda_fmllr, data/test --> data-fmllr-tri3/test, using : raw-trans None, gmm exp/tri3, trans exp/tri3/decode_test
steps/nnet/make_fmllr_feats.sh --nj 10 --cmd run.pl --transform-dir exp/tri3/decode_dev data-fmllr-tri3/dev data/dev exp/tri3 data-fmllr-tri3/dev/log data-fmllr-tri3/dev/data
steps/nnet/make_fmllr_feats.sh: feature type is lda_fmllr
utils/copy_data_dir.sh: copied data from data/dev to data-fmllr-tri3/dev
utils/validate_data_dir.sh: Successfully validated data-directory data-fmllr-tri3/dev
steps/nnet/make_fmllr_feats.sh: Done!, type lda_fmllr, data/dev --> data-fmllr-tri3/dev, using : raw-trans None, gmm exp/tri3, trans exp/tri3/decode_dev
steps/nnet/make_fmllr_feats.sh --nj 10 --cmd run.pl --transform-dir exp/tri3_ali data-fmllr-tri3/train data/train exp/tri3 data-fmllr-tri3/train/log data-fmllr-tri3/train/data
steps/nnet/make_fmllr_feats.sh: feature type is lda_fmllr
utils/copy_data_dir.sh: copied data from data/train to data-fmllr-tri3/train
utils/validate_data_dir.sh: Successfully validated data-directory data-fmllr-tri3/train
steps/nnet/make_fmllr_feats.sh: Done!, type lda_fmllr, data/train --> data-fmllr-tri3/train, using : raw-trans None, gmm exp/tri3, trans exp/tri3_ali
utils/subset_data_dir_tr_cv.sh data-fmllr-tri3/train data-fmllr-tri3/train_tr90 data-fmllr-tri3/train_cv10
/Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/utils/subset_data_dir.sh: reducing #utt from     3696 to     3320
/Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/utils/subset_data_dir.sh: reducing #utt from     3696 to      376
steps/nnet/decode.sh --nj 20 --cmd run.pl --acwt 0.2 exp/tri3/graph data-fmllr-tri3/test exp/dnn4_pretrain-dbn_dnn/decode_test
steps/nnet/decode.sh --nj 20 --cmd run.pl --acwt 0.2 exp/tri3/graph data-fmllr-tri3/dev exp/dnn4_pretrain-dbn_dnn/decode_dev
steps/nnet/align.sh --nj 20 --cmd run.pl data-fmllr-tri3/train data/lang exp/dnn4_pretrain-dbn_dnn exp/dnn4_pretrain-dbn_dnn_ali
steps/nnet/align.sh: aligning data 'data-fmllr-tri3/train' using nnet/model 'exp/dnn4_pretrain-dbn_dnn', putting alignments in 'exp/dnn4_pretrain-dbn_dnn_ali'
steps/nnet/align.sh: done aligning data.
steps/nnet/make_denlats.sh --nj 20 --cmd run.pl --acwt 0.2 --lattice-beam 10.0 --beam 18.0 data-fmllr-tri3/train data/lang exp/dnn4_pretrain-dbn_dnn exp/dnn4_pretrain-dbn_dnn_denlats
Making unigram grammar FST in exp/dnn4_pretrain-dbn_dnn_denlats/lang
Compiling decoding graph in exp/dnn4_pretrain-dbn_dnn_denlats/dengraph
tree-info exp/dnn4_pretrain-dbn_dnn/tree 
tree-info exp/dnn4_pretrain-dbn_dnn/tree 
fstpushspecial 
fsttablecompose exp/dnn4_pretrain-dbn_dnn_denlats/lang/L_disambig.fst exp/dnn4_pretrain-dbn_dnn_denlats/lang/G.fst 
fstminimizeencoded 
fstdeterminizestar --use-log=true 
fstisstochastic exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/LG.fst 
1.2886e-05 1.2886e-05
fstcomposecontext --context-size=3 --central-position=1 --read-disambig-syms=exp/dnn4_pretrain-dbn_dnn_denlats/lang/phones/disambig.int --write-disambig-syms=exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/disambig_ilabels_3_1.int exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/ilabels_3_1 
fstisstochastic exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/CLG_3_1.fst 
1.26958e-05 0
make-h-transducer --disambig-syms-out=exp/dnn4_pretrain-dbn_dnn_denlats/dengraph/disambig_tid.int --transition-scale=1.0 exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/ilabels_3_1 exp/dnn4_pretrain-dbn_dnn/tree exp/dnn4_pretrain-dbn_dnn/final.mdl 
fstdeterminizestar --use-log=true 
fstminimizeencoded 
fsttablecompose exp/dnn4_pretrain-dbn_dnn_denlats/dengraph/Ha.fst exp/dnn4_pretrain-dbn_dnn_denlats/lang/tmp/CLG_3_1.fst 
fstrmepslocal 
fstrmsymbols exp/dnn4_pretrain-dbn_dnn_denlats/dengraph/disambig_tid.int 
fstisstochastic exp/dnn4_pretrain-dbn_dnn_denlats/dengraph/HCLGa.fst 
0.000473648 -0.000485808
add-self-loops --self-loop-scale=0.1 --reorder=true exp/dnn4_pretrain-dbn_dnn/final.mdl 
steps/nnet/make_denlats.sh: generating denlats from data 'data-fmllr-tri3/train', putting lattices in 'exp/dnn4_pretrain-dbn_dnn_denlats'
steps/nnet/make_denlats.sh: done generating denominator lattices.
steps/nnet/train_mpe.sh --cmd run.pl --num-iters 6 --acwt 0.2 --do-smbr true data-fmllr-tri3/train data/lang exp/dnn4_pretrain-dbn_dnn exp/dnn4_pretrain-dbn_dnn_ali exp/dnn4_pretrain-dbn_dnn_denlats exp/dnn4_pretrain-dbn_dnn_smbr
Pass 1 (learnrate 0.00001)
 TRAINING FINISHED; Time taken = 8.11796 min; processed 2309.33 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.870485 over 1124823 frames.
Pass 2 (learnrate 1e-05)
 TRAINING FINISHED; Time taken = 8.23882 min; processed 2275.45 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.877623 over 1124823 frames.
Pass 3 (learnrate 1e-05)
 TRAINING FINISHED; Time taken = 8.03047 min; processed 2334.49 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.881648 over 1124823 frames.
Pass 4 (learnrate 1e-05)
 TRAINING FINISHED; Time taken = 6.56847 min; processed 2854.1 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.884561 over 1124823 frames.
Pass 5 (learnrate 1e-05)
 TRAINING FINISHED; Time taken = 6.45276 min; processed 2905.28 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.886877 over 1124823 frames.
Pass 6 (learnrate 1e-05)
 TRAINING FINISHED; Time taken = 6.51641 min; processed 2876.9 frames per second.
 Done 3696 files, 0 with no reference alignments, 0 with no lattices, 0 with other errors.
 Overall average frame-accuracy is 0.8888 over 1124823 frames.
MPE/sMBR training finished
Re-estimating priors by forwarding 10k utterances from training set.
steps/nnet/make_priors.sh --cmd run.pl --nj 20 data-fmllr-tri3/train exp/dnn4_pretrain-dbn_dnn_smbr
Accumulating prior stats by forwarding 'data-fmllr-tri3/train' with 'exp/dnn4_pretrain-dbn_dnn_smbr'
Succeeded creating prior counts 'exp/dnn4_pretrain-dbn_dnn_smbr/prior_counts' from 'data-fmllr-tri3/train'
steps/nnet/train_mpe.sh: Done. 'exp/dnn4_pretrain-dbn_dnn_smbr'
steps/nnet/decode.sh --nj 20 --cmd run.pl --nnet exp/dnn4_pretrain-dbn_dnn_smbr/1.nnet --acwt 0.2 exp/tri3/graph data-fmllr-tri3/test exp/dnn4_pretrain-dbn_dnn_smbr/decode_test_it1
steps/nnet/decode.sh --nj 20 --cmd run.pl --nnet exp/dnn4_pretrain-dbn_dnn_smbr/1.nnet --acwt 0.2 exp/tri3/graph data-fmllr-tri3/dev exp/dnn4_pretrain-dbn_dnn_smbr/decode_dev_it1
steps/nnet/decode.sh --nj 20 --cmd run.pl --nnet exp/dnn4_pretrain-dbn_dnn_smbr/6.nnet --acwt 0.2 exp/tri3/graph data-fmllr-tri3/test exp/dnn4_pretrain-dbn_dnn_smbr/decode_test_it6
steps/nnet/decode.sh --nj 20 --cmd run.pl --nnet exp/dnn4_pretrain-dbn_dnn_smbr/6.nnet --acwt 0.2 exp/tri3/graph data-fmllr-tri3/dev exp/dnn4_pretrain-dbn_dnn_smbr/decode_dev_it6
Success
============================================================================
                    Getting Results [see RESULTS file]                    
============================================================================
%WER 32.0 | 400 15057 | 71.6 19.4 9.0 3.6 32.0 100.0 | -0.459 | exp/mono/decode_dev/score_5/ctm_39phn.filt.sys
%WER 24.8 | 400 15057 | 79.0 15.9 5.1 3.8 24.8 100.0 | -0.162 | exp/tri1/decode_dev/score_10/ctm_39phn.filt.sys
%WER 22.8 | 400 15057 | 80.9 14.3 4.9 3.6 22.8 99.5 | -0.288 | exp/tri2/decode_dev/score_10/ctm_39phn.filt.sys
%WER 20.3 | 400 15057 | 82.9 12.6 4.5 3.1 20.3 99.3 | -0.591 | exp/tri3/decode_dev/score_10/ctm_39phn.filt.sys
%WER 23.1 | 400 15057 | 80.2 14.7 5.0 3.4 23.1 99.5 | -0.210 | exp/tri3/decode_dev.si/score_10/ctm_39phn.filt.sys
%WER 21.2 | 400 15057 | 82.2 12.4 5.4 3.5 21.2 99.5 | -0.856 | exp/tri4_nnet/decode_dev/score_4/ctm_39phn.filt.sys
%WER 17.8 | 400 15057 | 85.0 11.1 4.0 2.8 17.8 99.0 | -0.306 | exp/sgmm2_4/decode_dev/score_8/ctm_39phn.filt.sys
%WER 18.2 | 400 15057 | 84.9 11.3 3.8 3.1 18.2 99.3 | -0.286 | exp/sgmm2_4_mmi_b0.1/decode_dev_it1/score_8/ctm_39phn.filt.sys
%WER 18.4 | 400 15057 | 84.6 11.4 4.1 3.0 18.4 99.8 | -0.226 | exp/sgmm2_4_mmi_b0.1/decode_dev_it2/score_9/ctm_39phn.filt.sys
%WER 18.5 | 400 15057 | 84.6 11.4 4.0 3.0 18.5 99.8 | -0.244 | exp/sgmm2_4_mmi_b0.1/decode_dev_it3/score_9/ctm_39phn.filt.sys
%WER 18.4 | 400 15057 | 84.6 11.4 4.0 3.0 18.4 99.8 | -0.252 | exp/sgmm2_4_mmi_b0.1/decode_dev_it4/score_9/ctm_39phn.filt.sys
%WER 17.6 | 400 15057 | 85.0 10.6 4.4 2.6 17.6 99.3 | -1.126 | exp/dnn4_pretrain-dbn_dnn/decode_dev/score_4/ctm_39phn.filt.sys
%WER 17.6 | 400 15057 | 85.0 10.6 4.4 2.6 17.6 99.3 | -0.771 | exp/dnn4_pretrain-dbn_dnn_smbr/decode_dev_it1/score_5/ctm_39phn.filt.sys
%WER 17.5 | 400 15057 | 85.6 10.7 3.7 3.2 17.5 99.3 | -0.749 | exp/dnn4_pretrain-dbn_dnn_smbr/decode_dev_it6/score_5/ctm_39phn.filt.sys
%WER 16.9 | 400 15057 | 85.6 11.0 3.3 2.5 16.9 99.3 | -0.024 | exp/combine_2/decode_dev_it1/score_7/ctm_39phn.filt.sys
%WER 17.0 | 400 15057 | 85.9 11.0 3.1 2.9 17.0 99.5 | -0.105 | exp/combine_2/decode_dev_it2/score_6/ctm_39phn.filt.sys
%WER 17.0 | 400 15057 | 85.6 11.0 3.3 2.7 17.0 99.3 | -0.024 | exp/combine_2/decode_dev_it3/score_7/ctm_39phn.filt.sys
%WER 17.0 | 400 15057 | 85.7 11.0 3.3 2.7 17.0 99.3 | -0.028 | exp/combine_2/decode_dev_it4/score_7/ctm_39phn.filt.sys
%WER 32.3 | 192 7215 | 70.4 19.4 10.2 2.7 32.3 100.0 | -0.292 | exp/mono/decode_test/score_6/ctm_39phn.filt.sys
%WER 25.9 | 192 7215 | 78.0 16.4 5.6 3.9 25.9 100.0 | -0.103 | exp/tri1/decode_test/score_10/ctm_39phn.filt.sys
%WER 23.8 | 192 7215 | 79.7 14.8 5.5 3.4 23.8 99.5 | -0.272 | exp/tri2/decode_test/score_10/ctm_39phn.filt.sys
%WER 21.2 | 192 7215 | 81.7 13.4 4.9 3.0 21.2 99.0 | -0.582 | exp/tri3/decode_test/score_10/ctm_39phn.filt.sys
%WER 23.8 | 192 7215 | 79.6 15.1 5.3 3.4 23.8 99.5 | -0.289 | exp/tri3/decode_test.si/score_9/ctm_39phn.filt.sys
%WER 22.5 | 192 7215 | 81.0 13.2 5.8 3.5 22.5 100.0 | -0.896 | exp/tri4_nnet/decode_test/score_4/ctm_39phn.filt.sys
%WER 19.2 | 192 7215 | 83.1 12.1 4.8 2.4 19.2 99.0 | -0.139 | exp/sgmm2_4/decode_test/score_10/ctm_39phn.filt.sys
%WER 19.6 | 192 7215 | 83.4 12.2 4.4 3.0 19.6 99.0 | -0.230 | exp/sgmm2_4_mmi_b0.1/decode_test_it1/score_9/ctm_39phn.filt.sys
%WER 19.9 | 192 7215 | 83.7 12.3 4.0 3.6 19.9 99.0 | -0.420 | exp/sgmm2_4_mmi_b0.1/decode_test_it2/score_7/ctm_39phn.filt.sys
%WER 20.0 | 192 7215 | 84.0 12.4 3.6 4.0 20.0 99.0 | -0.632 | exp/sgmm2_4_mmi_b0.1/decode_test_it3/score_6/ctm_39phn.filt.sys
%WER 19.9 | 192 7215 | 83.9 12.2 3.9 3.7 19.9 99.0 | -0.459 | exp/sgmm2_4_mmi_b0.1/decode_test_it4/score_7/ctm_39phn.filt.sys
%WER 18.3 | 192 7215 | 84.6 10.8 4.6 2.8 18.3 100.0 | -1.264 | exp/dnn4_pretrain-dbn_dnn/decode_test/score_4/ctm_39phn.filt.sys
%WER 18.2 | 192 7215 | 84.5 10.8 4.7 2.7 18.2 100.0 | -0.852 | exp/dnn4_pretrain-dbn_dnn_smbr/decode_test_it1/score_5/ctm_39phn.filt.sys
%WER 18.3 | 192 7215 | 85.0 11.2 3.9 3.3 18.3 100.0 | -0.830 | exp/dnn4_pretrain-dbn_dnn_smbr/decode_test_it6/score_5/ctm_39phn.filt.sys
%WER 18.3 | 192 7215 | 84.6 11.9 3.5 2.9 18.3 99.5 | -0.058 | exp/combine_2/decode_test_it1/score_6/ctm_39phn.filt.sys
%WER 18.3 | 192 7215 | 84.6 11.9 3.5 2.9 18.3 99.0 | -0.067 | exp/combine_2/decode_test_it2/score_6/ctm_39phn.filt.sys
%WER 18.3 | 192 7215 | 84.6 11.9 3.5 2.9 18.3 99.0 | -0.069 | exp/combine_2/decode_test_it3/score_6/ctm_39phn.filt.sys
%WER 18.4 | 192 7215 | 84.6 12.0 3.5 3.0 18.4 99.0 | -0.058 | exp/combine_2/decode_test_it4/score_6/ctm_39phn.filt.sys
============================================================================
Finished successfully on Sun Jun 5 11:16:53 CST 2016
============================================================================
➜  kaldi/egs/timit/s5 master ✗ 
```